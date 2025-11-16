import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../../middleware/authHandler";
import { BuildService } from "./build.service";

export class BuildController {
  static async buildSite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uid = req.user?.uid;
      if (!uid) throw new Error("Usuario no autenticado");

      const html = await BuildService.buildUserSite(uid);

      res
        .status(200)
        .setHeader("Content-Type", "text/html")
        .send(html);

      console.info(`[CONTROLLER build] -> success -> HTML enviado al cliente`);
    } catch (error) {
      console.error(`[CONTROLLER build] -> error -> ${(error as Error).message}`);
      next(error);
    }
  }
}
