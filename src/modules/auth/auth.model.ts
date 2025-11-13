import { admin, db } from "../../config/firebase";

export interface UserData {
  uid: string;
  email: string;
  displayName?: string | undefined;
  plan?: string;
}

export class AuthModel {
  static async createUserInFirebase(email: string, password: string, displayName?: string): Promise<UserData> {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: displayName ?? null,
    });

    // opcional: guardar info del usuario en Firestore
    await db.collection("users").doc(userRecord.uid).set({
      email,
      displayName: displayName || "",
      plan: "free",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      uid: userRecord.uid,
      email: userRecord.email!,
      displayName: userRecord.displayName,
      plan: "free",
    };
  }

  static async verifyUserToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return await admin.auth().verifyIdToken(idToken, true);
  }

  static async revokeUserTokens(uid: string): Promise<void> {
    await admin.auth().revokeRefreshTokens(uid);
  }
}
