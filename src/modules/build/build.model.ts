import { db } from "../../config/firebase";
import type { MiWeb } from "../../types/miWeb";

export class BuildModel {
  /**
   * Devuelve el objeto miWeb de un usuario dado su uid.
   */
  static async getMiWebByUserId(uid: string): Promise<MiWeb | null> {
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) return null;
    const data = doc.data();

    return data?.miWeb || null;
  }
}
