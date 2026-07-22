import { Router } from "express";
import { NewsController } from "@/controllers/news.controller";
import { authMiddleware } from "@/middleware/auth.middleware";

const router = Router();
const controller = new NewsController();

// Public routes
// GET /api/news                  — Get all news (with pagination & filter)
router.get("/", controller.findAll.bind(controller));

// GET /api/news/slug/:slug        — Get single news by slug
router.get("/slug/:slug", controller.findBySlug.bind(controller));

// GET /api/news/:id               — Get single news by ID
router.get("/:id", controller.findById.bind(controller));

// Protected routes (require JWT)
// POST /api/news                  — Create news
router.post("/", authMiddleware, controller.create.bind(controller));

// PUT /api/news/:id               — Update news
router.put("/:id", authMiddleware, controller.update.bind(controller));

// DELETE /api/news/:id            — Delete news
router.delete("/:id", authMiddleware, controller.delete.bind(controller));

export default router;
