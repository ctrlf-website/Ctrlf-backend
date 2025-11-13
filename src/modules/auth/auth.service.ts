import { AuthModel, type UserData } from "./auth.model";

export class AuthService {
  static async registerUser(email: string, password: string, displayName?: string): Promise<UserData> {
    const user = await AuthModel.createUserInFirebase(email, password, displayName);
    return user;
  }

  static async loginUser(idToken: string): Promise<UserData> {
    const decoded = await AuthModel.verifyUserToken(idToken);

    // opcional: obtener más info desde Firestore
    const userDoc = await (await import("../../config/firebase")).db.collection("users").doc(decoded.uid).get();
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
