import { BuildModel } from "./build.model.js";
import { renderHTMLTemplate } from "./build.render.js";

export class BuildService {
  static async buildUserSite(uid: string): Promise<string> {
    console.info(`[SERVICE build] -> start -> Fetching miWeb for ${uid}`);

    const miWeb = await BuildModel.getMiWebByUserId(uid);
    if (!miWeb) throw new Error("miWeb no encontrado para este usuario");

    console.info(`[SERVICE build] -> success -> miWeb obtenido`);

    // Aplica lógica de negocio si fuera necesario (e.g. sanitizar campos, defaults)
    const html = renderHTMLTemplate(miWeb);
    return html;
  }
}
