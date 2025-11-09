// import type { Request, Response } from 'express';
// import { AuthService } from './auth.service.js';

// export const AuthController = {
//   async register(req: Request, res: Response) {
//     try {
//       const { email, password, name } = req.body;
//       const user = await AuthService.register(email, password, name);
//       res.status(201).json(user);
//     } catch (error: any) {
//       res.status(400).json({ error: error.message });
//     }
//   },

//   async login(req: Request, res: Response) {
//     try {
//       const { idToken } = req.body;
//       const user = await AuthService.login(idToken);
//       res.status(200).json(user);
//     } catch (error: any) {
//       res.status(401).json({ error: error.message });
//     }
//   },

//   async logout(req: Request, res: Response) {
//     const response = await AuthService.logout();
//     res.status(200).json(response);
//   },
// };
// src/modules/auth/auth.controller.ts
// src/modules/auth/auth.controller.ts
import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";

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
