import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../../middleware/authHandler.js";
import { PublishService } from "./publish.service.js";

export class PublishController {
  static async publishSite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uid = req.user?.uid;
      if (!uid) throw new Error("Usuario no autenticado");

      console.info(`[CONTROLLER publish] -> init -> Generando sitio para ${uid}`);

      const html = await PublishService.buildUserSite(uid);

      res
        .status(200)
        .setHeader("Content-Type", "text/html")
        .send(html);

      console.info(`[CONTROLLER publish] -> success -> HTML enviado al cliente`);
    } catch (error) {
      console.error(`[CONTROLLER publish] -> error -> ${(error as Error).message}`);
      next(error);
    }
  }
}
