// import { db } from "../../config/firebase.js";
// import type { User } from "../../types/user.js";


// const usersCollection = db.collection('users');

// export const AuthModel = {
//   async createUser(user: User): Promise<void> {
//     await usersCollection.doc(user.uid).set(user);
//   },

//   async getUserById(uid: string): Promise<User | null> {
//     const doc = await usersCollection.doc(uid).get();
//     return doc.exists ? (doc.data() as User) : null;
//   },

//   async getUserByEmail(email: string): Promise<User | null> {
//     const snapshot = await usersCollection.where('email', '==', email).get();
//     if (snapshot.empty) return null;
//     const doc = snapshot.docs[0];
//     return doc ? (doc.data() as User) : null;
//   },

//   async updateUser(uid: string, data: Partial<User>): Promise<void> {
//     await usersCollection.doc(uid).update(data);
//   },
// };
// src/modules/auth/auth.model.ts
import { admin, db } from "../../config/firebase.js";

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
