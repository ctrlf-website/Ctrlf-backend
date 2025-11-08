import { db } from '../../config/firebase';
import type { User } from '../../types/user';

const usersCollection = db.collection('users');

export const AuthModel = {
  async createUser(user: User): Promise<void> {
    await usersCollection.doc(user.uid).set(user);
  },

  async getUserById(uid: string): Promise<User | null> {
    const doc = await usersCollection.doc(uid).get();
    return doc.exists ? (doc.data() as User) : null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const snapshot = await usersCollection.where('email', '==', email).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return doc ? (doc.data() as User) : null;
  },

  async updateUser(uid: string, data: Partial<User>): Promise<void> {
    await usersCollection.doc(uid).update(data);
  },
};
