import type { Request, Response } from "express";
import { AuthService } from "@/services/auth.service";
import { registerSchema, loginSchema } from "@news-portal/shared";

const service = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.format() });
      return;
    }

    try {
      const user = await service.register(parsed.data);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  }

  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.format() });
      return;
    }

    try {
      const result = await service.login(parsed.data);
      res.status(200).json({ message: "Login successful", ...result });
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Login failed" });
    }
  }
}
