import { PublishModel } from "./publish.model.js";
import { renderHTMLTemplate } from "./publish.render.js";

export class PublishService {
  static async buildUserSite(uid: string): Promise<string> {
    console.info(`[SERVICE publish] -> start -> Fetching miWeb for ${uid}`);

    const miWeb = await PublishModel.getMiWebByUserId(uid);
    if (!miWeb) throw new Error("miWeb no encontrado para este usuario");

    console.info(`[SERVICE publish] -> success -> miWeb obtenido`);

    // Aplica lógica de negocio si fuera necesario (e.g. sanitizar campos, defaults)
    const html = renderHTMLTemplate(miWeb);
    return html;
  }
}
