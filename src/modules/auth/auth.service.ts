// import { auth } from 'firebase-admin';
// import type { User } from '../../types/user.js';
// import { AuthModel } from './auth.model.js';

// export const AuthService = {
//   async register(email: string, password: string, name: string): Promise<User> {
//     const userRecord = await auth().createUser({ email, password, displayName: name });

//     const newUser: User = {
//       uid: userRecord.uid,
//       email,
//       name,
//       createdAt: new Date().toISOString(),
//       plan: 'free',
//     };

//     await AuthModel.createUser(newUser);
//     return newUser;
//   },

//   async login(idToken: string): Promise<User> {
//     const decoded = await auth().verifyIdToken(idToken);
//     const user = await AuthModel.getUserById(decoded.uid);
//     if (!user) throw new Error('User not found');
//     return user;
//   },

//   async logout(): Promise<{ message: string }> {
//     // En Firebase, logout se maneja en el cliente (borrando el token)
//     return { message: 'Logout successful on client side' };
//   },
// };
// src/modules/auth/auth.service.ts
import { AuthModel, type UserData } from "./auth.model.js";

export class AuthService {
  static async registerUser(email: string, password: string, displayName?: string): Promise<UserData> {
    const user = await AuthModel.createUserInFirebase(email, password, displayName);
    return user;
  }

  static async loginUser(idToken: string): Promise<UserData> {
    const decoded = await AuthModel.verifyUserToken(idToken);

    // opcional: obtener más info desde Firestore
    const userDoc = await (await import("../../config/firebase.js")).db.collection("users").doc(decoded.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    return {
      uid: decoded.uid,
      email: decoded.email || "",
      displayName: userData?.displayName,
      plan: userData?.plan,
    };
  }

  static async logoutUser(uid: string): Promise<void> {
    await AuthModel.revokeUserTokens(uid);
  }
}
