export interface User {
  uid: string;
  email: string;
  name: string;
  createdAt: string;
  plan: 'free' | 'pro';
}
