import { Request, Response } from "express";
import { AuthService } from "./auth.service.ts";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.email(),
  username: z.string().min(5).max(25),
  password: z.string().min(8),
  role: z.enum(["user", "admin"]).optional().default("user"),
});

const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { email, username, password, role} = RegisterSchema.parse(req.body);
      const result = await AuthService.register(
        email,
        username,
        password,
        role,
      );
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = LoginSchema.parse(req.body);
      const result = await AuthService.login(email, password);
      res.status(201).json(result);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  },
};
