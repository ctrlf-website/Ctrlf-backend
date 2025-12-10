import { SiteService } from "./site.service";
import { validateMiWeb } from "./site.model";
import type { NextFunction, Response, Request } from "express";
import type { AuthenticatedRequest } from "../../middleware/authHandler";

export class SiteController {
  static async getSite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uid = req.user?.uid;
      if (!uid) throw new Error("Usuario no autenticado");

      const site = await SiteService.getUserSite(uid);
      res.status(200).json(site);
    } catch (error) {
      next(error);
    }
  }

  static async updateSite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uid = req.user?.uid;
      if (!uid) throw new Error("Usuario no autenticado");

      // 1️⃣ Parsear JSON enviado en FormData
      const raw = req.body.miWeb;
      if (!raw) throw new Error("Falta el campo miWeb");

      const miWebParsed = JSON.parse(raw);

      // 2️⃣ Ejecutar validación del modelo
      const validData = validateMiWeb(miWebParsed);

      // 3️⃣ Imagen (opcional)
      // const files = req.files as Express.Multer.File[] || []; // array de 0 a 10 archivos
      const files = req.files as {
        headerLogo?: Express.Multer.File[];
        headerBackground?: Express.Multer.File[];
        cardImages?: Express.Multer.File[];
      };
      const updatedSite = await SiteService.upsertUserSite(
        uid,
        validData,
        files
      );

      res.status(200).json(updatedSite);
    } catch (error) {
      next(error);
    }
  }
}
