import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";

const router = Router();
const controller = new AuthController();

// POST /api/auth/register
router.post("/register", controller.register.bind(controller));

// POST /api/auth/login
router.post("/login", controller.login.bind(controller));

export default router;
