import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, displayName } = req.body;

      if (!email || !password) {
        const err = new Error("Email y contraseña son requeridos");
        (err as any).status = 400;
        throw err;
      }

      const user = await AuthService.registerUser(email, password, displayName);
      res.status(201).json({ status: "success", user });
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      console.log(
        `[CONTROLLER] -> auth HEADERS -> ${authHeader} ${req.headers} ->`
      );

      const idToken =
        authHeader && authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : req.body.idToken;
      console.log(`[CONTROLLER] -> ID token -> ${idToken}  ->`);

      if (!idToken) {
        const err = new Error("Token no provisto");
        (err as any).status = 400;
        throw err;
      }

      const user = await AuthService.loginUser(idToken);
      res.status(200).json({ status: "ok", user });
    } catch (error) {
      next(error);
    }
  }

  static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uid } = req.body;

      if (!uid) {
        const err = new Error("UID no provisto");
        (err as any).status = 400;
        throw err;
      }

      await AuthService.logoutUser(uid);
      res.status(200).json({ status: "ok", message: "Usuario desconectado" });
    } catch (error) {
      next(error);
    }
  }
}
