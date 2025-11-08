import { auth } from 'firebase-admin';
import { AuthModel } from './auth.model';
import type { User } from '../../types/user';

export const AuthService = {
  async register(email: string, password: string, name: string): Promise<User> {
    const userRecord = await auth().createUser({ email, password, displayName: name });

    const newUser: User = {
      uid: userRecord.uid,
      email,
      name,
      createdAt: new Date().toISOString(),
      plan: 'free',
    };

    await AuthModel.createUser(newUser);
    return newUser;
  },

  async login(idToken: string): Promise<User> {
    const decoded = await auth().verifyIdToken(idToken);
    const user = await AuthModel.getUserById(decoded.uid);
    if (!user) throw new Error('User not found');
    return user;
  },

  async logout(): Promise<{ message: string }> {
    // En Firebase, logout se maneja en el cliente (borrando el token)
    return { message: 'Logout successful on client side' };
  },
};
