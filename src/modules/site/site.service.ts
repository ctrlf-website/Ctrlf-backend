import { db } from "../../config/firebase";
import type { MiWeb } from "../../types/miWeb";

export class SiteService {
  static async getUserSite(uid: string): Promise<MiWeb | null> {
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) return null;
    const data = doc.data();
    return data?.miWeb || null;
  }

  static async upsertUserSite(uid: string, data: MiWeb): Promise<MiWeb> {
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({ miWeb: data }, { merge: true });
      console.log(`[SERVICE site] -> created -> nuevo miWeb para user ${uid}`);
    } else {
      await userRef.update({ miWeb: data });
      console.log(
        `[SERVICE site] -> updated -> miWeb actualizado para user ${uid}`
      );
    }

    return data;
  }
}
