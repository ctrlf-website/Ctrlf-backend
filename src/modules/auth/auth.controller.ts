
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const user = await AuthService.register(email, password, name);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { idToken } = req.body;
      const user = await AuthService.login(idToken);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  },

  async logout(req: Request, res: Response) {
    const response = await AuthService.logout();
    res.status(200).json(response);
  },
};
