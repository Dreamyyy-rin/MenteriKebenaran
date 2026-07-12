/*
* AuthController
* In this file, we receive the data from client request and process it into register service that had logic that will going to repository.
* This code and comments is allowed to delete.
*/

import type { Request, Response } from "express";
import { AuthService } from "@/services/auth.service";
import { registerSchema } from "@news-portal/shared";

const service = new AuthService();

export class AuthController {

  async register(req: Request, res: Response) {
    // Validate register input using shared Zod schema
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parsed.error.format()
      });
      return;
    }

    try {
      const user = await service.register(parsed.data);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  }

}
