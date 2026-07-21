import type { Request, Response } from "express";
import { NewsService } from "@/services/news.service";

const service = new NewsService();

export class NewsController {
  async create(req: Request, res: Response) {
    try {
      const { title, artikel, foto, category, tags } = req.body;

      if (!title || !artikel) {
        res.status(400).json({ error: "Title and artikel are required" });
        return;
      }

      const authorId = req.user!.userId;
      const news = await service.create({ title, artikel, foto, category, tags, authorId });
      res.status(201).json({ message: "News created successfully", news });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create news" });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query["page"] as string) || 1;
      const limit = parseInt(req.query["limit"] as string) || 10;
      const category = req.query["category"] as string | undefined;
      const search = req.query["search"] as string | undefined;

      const result = await service.findAll({ page, limit, category, search });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch news" });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const news = await service.findById(req.params["id"]!);
      res.status(200).json(news);
    } catch (error: any) {
      const status = error.message === "News not found" ? 404 : 500;
      res.status(status).json({ error: error.message || "Failed to fetch news" });
    }
  }

  async findBySlug(req: Request, res: Response) {
    try {
      const news = await service.findBySlug(req.params["slug"]!);
      res.status(200).json(news);
    } catch (error: any) {
      const status = error.message === "News not found" ? 404 : 500;
      res.status(status).json({ error: error.message || "Failed to fetch news" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { title, artikel, foto, category, tags } = req.body;
      const requesterId = req.user!.userId;
      const requesterRole = req.user!.role;

      const existingNews = await service.findByIdNoIncrement(req.params["id"]!);
      const authorId = typeof existingNews.author === "string"
        ? existingNews.author
        : existingNews.author._id?.toString?.() ?? existingNews.author.toString();

      if (authorId !== requesterId && requesterRole !== "admin") {
        res.status(403).json({ error: "Forbidden: you are not allowed to update this news article" });
        return;
      }

      const news = await service.update(req.params["id"]!, { title, artikel, foto, category, tags });
      res.status(200).json({ message: "News updated successfully", news });
    } catch (error: any) {
      const status = error.message === "News not found" ? 404 : 500;
      res.status(status).json({ error: error.message || "Failed to update news" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const requesterId = req.user!.userId;
      const requesterRole = req.user!.role;

      const existingNews = await service.findByIdNoIncrement(req.params["id"]!);
      const authorId = typeof existingNews.author === "string"
        ? existingNews.author
        : existingNews.author._id?.toString?.() ?? existingNews.author.toString();

      if (authorId !== requesterId && requesterRole !== "admin") {
        res.status(403).json({ error: "Forbidden: you are not allowed to delete this news article" });
        return;
      }

      await service.delete(req.params["id"]!);
      res.status(200).json({ message: "News deleted successfully" });
    } catch (error: any) {
      const status = error.message === "News not found" ? 404 : 500;
      res.status(status).json({ error: error.message || "Failed to delete news" });
    }
  }
}
