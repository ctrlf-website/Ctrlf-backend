import type { NextFunction, Response, Request } from "express";
import type { AuthenticatedRequest } from "../../middleware/authHandler";
import { BuildService } from "../build/build.service";
import { DeployService } from "./deploy.service";

export class DeployController {
  static async deploySite(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const uid = req.user?.uid;
      if (!uid) throw new Error("Usuario no autenticado");

      // 1️⃣ Generar HTML con el módulo Build
      const html = await BuildService.buildUserSite(uid);

      // 2️⃣ Desplegar en Firebase Hosting
      const url = await DeployService.deployToFirebase(uid, html);

      res.status(200).json({
        status: "ok",
        message: "Sitio desplegado correctamente",
        url,
      });
    } catch (error) {
      console.error(`[CONTROLLER deploy] -> error: ${error}`);
      next(error);
    }
  }
}
