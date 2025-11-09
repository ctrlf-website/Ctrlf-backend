import type { NextFunction, Response, Request } from "express";
import { admin, auth } from "../config/firebase.js";
/**
 * Extiende el tipo Request para incluir user decodificado
 */
export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

/**
 * Middleware de autenticación Firebase
 */
export const verifyFirebaseToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn(
        `[MIDDLEWARE auth] -> missing -> Header Authorization ausente o inválido`
      );
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.warn(
        `[MIDDLEWARE auth] -> missing -> Token ausente en Header Authorization`
      );
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = await auth.verifyIdToken(token);

    req.user = decodedToken;
    console.info(
      `[MIDDLEWARE auth] -> success -> Token verificado para uid ${decodedToken.uid}`
    );

    next();
  } catch (error) {
    console.warn(
      `[MIDDLEWARE auth] -> invalid -> Token inválido o expirado: ${(error as Error).message}`
    );
    return res.status(401).json({ error: "Unauthorized" });
  }
};
