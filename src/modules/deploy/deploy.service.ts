import { DeployModel } from "./deploy.model";
import { exec } from "child_process";
import path from "path";
import fs from "fs/promises";
import { promisify } from "util";

const execAsync = promisify(exec);

export class DeployService {
  static FIREBASE_PROJECT = "ctrl-f-1b367";
  static FIREBASE_TOKEN = process.env.FIREBASE_DEPLOY_TOKEN; 

  static async deployToFirebase(uid: string, html: string): Promise<string> {
    if (!this.FIREBASE_TOKEN) {
      throw new Error("FIREBASE_TOKEN no configurado en variables de entorno");
    }

    // 1️⃣ Crear archivo temporal index.html
    const sitePath = await DeployModel.createTempSite(uid, html);
    console.log(`[SERVICE deploy] -> archivo generado en ${sitePath}`);

    try {
      // 2️⃣ Verificar si el sitio ya existe
      const { stdout: listOutput } = await execAsync(
        `firebase hosting:sites:list --project ${this.FIREBASE_PROJECT} --token ${this.FIREBASE_TOKEN}`
      );

      const exists = listOutput.includes(uid);
      if (!exists) {
        console.log(`[SERVICE deploy] -> sitio ${uid} no existe, creando...`);
        await execAsync(
          `firebase hosting:sites:create ${uid} --project ${this.FIREBASE_PROJECT} --token ${this.FIREBASE_TOKEN}`
        );
        console.log(`[SERVICE deploy] -> sitio ${uid} creado correctamente`);
      } else {
        console.log(`[SERVICE deploy] -> sitio ${uid} ya existe`);
      }

      // 3️⃣ Crear firebase.json temporal apuntando a este sitio
      const firebaseJsonPath = path.join(sitePath, "firebase.json");
      const firebaseJson = {
        hosting: {
          site: uid,
          public: sitePath,
          ignore: ["firebase.json", "**/.*", "**/node_modules/**"],
        },
      };
      await fs.writeFile(
        firebaseJsonPath,
        JSON.stringify(firebaseJson, null, 2),
        "utf8"
      );

      // 4️⃣ Ejecutar deploy
      console.log(`[SERVICE deploy] -> ejecutando firebase deploy`);
      const { stdout, stderr } = await execAsync(
        `firebase deploy --only hosting:${uid} --project ${this.FIREBASE_PROJECT} --token ${this.FIREBASE_TOKEN}`,
        { cwd: sitePath }
      );

      if (stderr) console.warn(`[SERVICE deploy] -> stderr: ${stderr}`);
      console.log(`[SERVICE deploy] -> stdout: ${stdout}`);

      // 5️⃣ Limpieza del archivo temporal
      await DeployModel.cleanTempSite(uid);

      // 6️⃣ Devolver URL final
      const url = `https://${uid}.web.app`;
      return url;
    } catch (error: any) {
      console.error(`[SERVICE deploy] -> error: ${error.message}`);
      
      throw new Error("Fallo al desplegar el sitio");
    }
  }
}
