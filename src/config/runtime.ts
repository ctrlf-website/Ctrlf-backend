import { GoogleAuth } from "google-auth-library";

export function isCloudRun(): boolean {
  return Boolean(process.env.K_SERVICE || process.env.GCP_PROJECT);
}

export async function getProjectId(): Promise<string> {
  // ☁️ Cloud Run / GCP
  const auth = new GoogleAuth();
  const projectId = await auth.getProjectId();

  if (!projectId) {
    throw new Error("Unable to resolve GCP projectId");
  }

  return projectId;
}
