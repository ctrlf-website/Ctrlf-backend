import 'dotenv/config';
import type { NodeEnv } from '../types/env';

interface Env {
  NODE_ENV: NodeEnv;
  FIREBASE_PROJECT_ID: string | undefined;
  FIREBASE_CLIENT_EMAIL: string | undefined;
  FIREBASE_PRIVATE_KEY: string | undefined;
  FIREBASE_PRIVATE_KEY_BASE64: string | undefined;
}

const env: Env = {
  NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) || 'development',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_PRIVATE_KEY_BASE64: process.env.FIREBASE_PRIVATE_KEY_BASE64,
};

// Validación básica
if (env.NODE_ENV === 'development') {
  const required = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var in development: ${key}`);
    }
  }
}

export default env;
