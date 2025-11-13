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
      res.status(200).json({ status: "ok", miWeb: site });
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

      const { miWeb } = req.body;

      const validData = validateMiWeb(miWeb);

      const updatedSite = await SiteService.upsertUserSite(uid, validData);
      res.status(200).json({ status: "ok", miWeb: updatedSite });
    } catch (error) {
      next(error);
    }
  }
}
