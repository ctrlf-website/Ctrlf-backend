import admin from 'firebase-admin';
import env from './env';

let firebaseApp: admin.app.App;

if (!admin.apps.length) {
  if (env.NODE_ENV === 'production') {
    try {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      console.info(`[CONFIG firebase] -> init -> Firebase inicializado con credenciales por defecto`);
    } catch (error) {
      console.warn(`[CONFIG firebase] -> warning -> No se pudo inicializar con applicationDefault()`);
      console.warn(`[CONFIG firebase] -> details -> ${(error as Error).message}`);
      console.warn(`[CONFIG firebase] -> action -> Revisar GOOGLE_APPLICATION_CREDENTIALS o permisos del Service Account`);
      // Fallback vacío (mantiene backend vivo)
      firebaseApp = admin.initializeApp();
    }

    // Verificación adicional de projectId
    if (!firebaseApp.options.projectId) {
      console.warn(`[CONFIG firebase] -> warning -> Firebase inicializado sin projectId válido`);
    }
  } else {
    // Desarrollo o staging → usar credenciales locales
    const privateKey =
      env.FIREBASE_PRIVATE_KEY ||
      (env.FIREBASE_PRIVATE_KEY_BASE64
        ? Buffer.from(env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8')
        : undefined);

    if (!privateKey) throw new Error('[CONFIG firebase] -> error -> Missing Firebase private key');
    if (!env.FIREBASE_PROJECT_ID) throw new Error('[CONFIG firebase] -> error -> Missing FIREBASE_PROJECT_ID');
    if (!env.FIREBASE_CLIENT_EMAIL) throw new Error('[CONFIG firebase] -> error -> Missing FIREBASE_CLIENT_EMAIL');

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });

    console.info(`[CONFIG firebase] -> init -> Firebase inicializado en entorno ${env.NODE_ENV}`);
  }
} else {
  firebaseApp = admin.app();
  console.info(`[CONFIG firebase] -> reuse -> Firebase app existente reutilizada`);
}

const db = admin.firestore(firebaseApp);
const auth: admin.auth.Auth = admin.auth(firebaseApp);

export { admin, db, auth };

