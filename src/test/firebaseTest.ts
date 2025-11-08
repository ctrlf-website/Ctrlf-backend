import { db, auth } from '../config/firebase.js';

async function testFirebase() {
  console.log(`[TEST firebase] -> start -> Iniciando prueba de conexión...`);

  try {
    // Test 1: Validar Auth
    const list = await auth.listUsers(1);
    console.log(`[TEST firebase] -> auth -> OK (${list.users.length} usuario(s) encontrados)`);

    // Test 2: Validar Firestore
    const collections = await db.listCollections();
    console.log(`[TEST firebase] -> firestore -> OK (${collections.length} colecciones detectadas)`);

    console.log(`[TEST firebase] -> success -> Conexión exitosa y Firebase inicializado correctamente.`);
    process.exit(0);
  } catch (error) {
    console.error(`[TEST firebase] -> error -> ${(error as Error).message}`);
    process.exit(1);
  }
}

testFirebase();
