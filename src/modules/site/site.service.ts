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
    files: {
      headerLogo?: Express.Multer.File[];
      headerBackground?: Express.Multer.File[];
      cardImages?: Express.Multer.File[];
    }
  ): Promise<MiWeb> {
    if (files) {
      // 1️⃣ Analizar imagen con SafeSearch
      // const validation = await validateImageNSFW(file.buffer);
      // if (!validation.safe) throw new Error(validation.reason);
      // 2️⃣ Subir a Cloudinary
      // const logoUrl = await uploadImageToCloudinary(file.buffer);
      // data.header.logoUrl = logoUrl;
      // const backgroundUrl = await uploadImageToCloudinary(file.buffer);
      // data.header.logoUrl = logoUrl;
      if (files.headerLogo?.[0]) {
        const uploadedLogoUrl = await uploadImageToCloudinary(
          files.headerLogo[0].buffer
        );
        data.header.logoUrl = uploadedLogoUrl;
      }

      // 2️⃣ HEADER BACKGROUND
      if (files.headerBackground?.[0]) {
        const uploadedBgUrl = await uploadImageToCloudinary(
          files.headerBackground[0].buffer
        );
        data.header.backgroundImageUrl = uploadedBgUrl;
      }
    }

    // 3️⃣ CARDS (si existen)
    // if (files.cardImages?.length) {
    //   data.cards = data.cards || []; // aseguramos array

    //   for (let i = 0; i < files.cardImages.length; i++) {
    //     const file = files.cardImages[i];
    //     const url = await uploadImageToCloudinary(file.buffer);

    //     // si la card ya existe la actualizamos, si no la creamos
    //     if (!data.cards[i]) data.cards[i] = {} as any;

    //     data.cards[i].imageUrl = url;
    //   }
    // }

    // 3️⃣ Guardar miWeb en Firestore
    const userRef = db.collection("users").doc(uid);
    await userRef.set({ miWeb: data }, { merge: true });

    return data;
  }
}
