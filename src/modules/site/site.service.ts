import { db } from "../../config/firebase";
import type { MiWeb } from "../../types/miWeb";
import { validateImageNSFW } from "../../services/imageFilter";
import { uploadImageToCloudinary } from "../image/upload.service";

export class SiteService {
  static async getUserSite(uid: string): Promise<MiWeb | null> {
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) return null;
    const data = doc.data();
    return data?.miWeb || null;
  }

  static async upsertUserSite(
    uid: string,
    data: MiWeb,
    file: Express.Multer.File | null
  ): Promise<MiWeb> {
    if (file) {
      // 1️⃣ Analizar imagen con SafeSearch
      const validation = await validateImageNSFW(file.buffer);
      if (!validation.safe) throw new Error(validation.reason);
      // 2️⃣ Subir a Cloudinary
      const logoUrl = await uploadImageToCloudinary(file.buffer);
      data.header.logoUrl = logoUrl;
    }

    // 3️⃣ Guardar miWeb en Firestore
    const userRef = db.collection("users").doc(uid);
    await userRef.set({ miWeb: data }, { merge: true });

    return data;
  }
}
