import { promisify } from "util";
import zlib from "zlib";
import crypto from "crypto";
import path from "path";
import { DeployModel } from "./deploy.model";
import { JWT } from "google-auth-library";

const gzip = promisify(zlib.gzip);

const FIREBASE_API_BASE = "https://firebasehosting.googleapis.com/v1beta1";

const SCOPES = [
  "https://www.googleapis.com/auth/firebase.hosting",
  "https://www.googleapis.com/auth/cloud-platform",
];

function getServiceAccountFromEnv() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!clientEmail || !privateKey || !projectId) {
    throw new Error(
      "Missing Firebase service account env vars. Required: FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID"
    );
  }

  return {
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
    projectId,
  };
}

async function getAccessToken() {
  const { clientEmail, privateKey } = getServiceAccountFromEnv();

  const jwtClient = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  const res = await jwtClient.authorize();
  if (!res || !res.access_token) {
    throw new Error("Failed to obtain access token for Firebase Hosting API");
  }
  return res.access_token;
}

export class DeployService {
  // PROJECT and site naming strategy
  static FIREBASE_PROJECT =
    process.env.FIREBASE_PROJECT_ID || getServiceAccountFromEnv().projectId;

  /**
   * Deploy the provided HTML as a single-file site at SITE_ID === uid.
   * Returns the web.app URL.
   */
  static async deployToFirebase(uid: string, html: string): Promise<string> {
    // 1) write temp site (keeps compatibility with your model)
    const sitePath = await DeployModel.createTempSite(uid, html);
    const indexFilePath = path.join(sitePath, "index.html");
    const fileBuffer = Buffer.from(html, "utf8");

    // 2) get access token
    const accessToken = await getAccessToken();

    try {
      // 3) create a new version for the site
      // endpoint: POST /v1beta1/sites/SITE_ID/versions
      const createVersionUrl = `${FIREBASE_API_BASE}/sites/${uid}/versions`;
      const createResp = await fetch(createVersionUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // optional config; you may set headers/caching here
          config: {
            headers: [
              {
                glob: "**",
                headers: {
                  "Cache-Control": "public, max-age=300",
                },
              },
            ],
          },
        }),
      });

      if (!createResp.ok) {
        const txt = await createResp.text();
        throw new Error(`versions.create failed: ${createResp.status} ${txt}`);
      }

      const versionObj = await createResp.json();
      // versionObj.name looks like "sites/SITE_ID/versions/VERSION_ID"
      const versionName: string = versionObj.name;
      const versionId = versionName.split("/").pop();
      if (!versionId)
        throw new Error("Could not parse versionId from version response");

      // 4) gzip file and compute sha256 of gzipped content
      const gzipped = await gzip(fileBuffer);
      const hash = crypto.createHash("sha256").update(gzipped).digest("hex");

      // 5) call versions.populateFiles with mapping { "/index.html": hash }
      const populateUrl = `${FIREBASE_API_BASE}/sites/${uid}/versions/${versionId}:populateFiles`;
      const populateResp = await fetch(populateUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            "/index.html": hash,
          },
        }),
      });

      if (!populateResp.ok) {
        const txt = await populateResp.text();
        throw new Error(
          `versions.populateFiles failed: ${populateResp.status} ${txt}`
        );
      }

      const populateJson = await populateResp.json();
      const uploadRequiredHashes: string[] =
        populateJson.uploadRequiredHashes || [];
      const uploadUrlBase: string = populateJson.uploadUrl; // e.g. https://upload-firebasehosting.googleapis.com/upload/sites/SITE_ID/versions/VERSION_ID/files

      // 6) upload files that are required (if our hash is required, upload gzipped buffer)
      if (uploadRequiredHashes.includes(hash)) {
        // upload to `${uploadUrlBase}/${hash}`
        const uploadUrl = `${uploadUrlBase}/${hash}`;
        const uploadResp = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/octet-stream",
            "Content-Encoding": "gzip",
          },
          body: gzipped,
        });

        if (!uploadResp.ok) {
          const txt = await uploadResp.text();
          throw new Error(`Upload file failed: ${uploadResp.status} ${txt}`);
        }
      }

      // 7) finalize version (PATCH status=FINALIZED)
      const finalizeUrl = `${FIREBASE_API_BASE}/sites/${uid}/versions/${versionId}?update_mask=status`;
      const finalizeResp = await fetch(finalizeUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "FINALIZED" }),
      });

      if (!finalizeResp.ok) {
        const txt = await finalizeResp.text();
        throw new Error(
          `versions.patch FINALIZE failed: ${finalizeResp.status} ${txt}`
        );
      }

      // 8) create a release for the version (deploy)
      const releaseUrl = `${FIREBASE_API_BASE}/sites/${uid}/releases`;
      const releaseResp = await fetch(releaseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          versionName: versionName,
        }),
      });

      if (!releaseResp.ok) {
        const txt = await releaseResp.text();
        throw new Error(`releases.create failed: ${releaseResp.status} ${txt}`);
      }

      // 9) cleanup temp files
      await DeployModel.cleanTempSite(uid);

      // 10) return URL
      return `https://${uid}.web.app`;
    } catch (err: any) {
      // keep temp files for debugging if you want (optional)
      console.error(
        `[DeployService] deployToFirebase error: ${err?.message || err}`
      );
      // rethrow to preserve your current controller behavior
      throw new Error(
        "Fallo al desplegar el sitio: " + (err?.message || String(err))
      );
    }
  }
}
