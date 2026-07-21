import type { Request, Response } from "express";
import { DiscussionService } from "@/services/discussion.service";

const service = new DiscussionService();

export class DiscussionController {
  async create(req: Request, res: Response) {
    try {
      const newsId = req.params["newsId"]!;
      const userId = req.user!.userId;
      const { comment } = req.body;

      if (!comment) {
        res.status(400).json({ error: "Comment is required" });
        return;
      }

      const discussion = await service.create({ newsId, userId, comment });
      res.status(201).json({ message: "Comment posted successfully", discussion });
    } catch (error: any) {
      const status = error.message === "News article not found" ? 404 : 500;
      res.status(status).json({ error: error.message || "Failed to post comment" });
    }
  }

  async findByNewsId(req: Request, res: Response) {
    try {
      const newsId = req.params["newsId"]!;
      const discussions = await service.findByNewsId(newsId);
      res.status(200).json(discussions);
    } catch (error: any) {
      const status = error.message === "News article not found" ? 404 : 500;
      res.status(status).json({ error: error.message || "Failed to fetch discussions" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const discussionId = req.params["id"]!;
      const requesterId = req.user!.userId;
      const requesterRole = req.user!.role;

      await service.delete(discussionId, requesterId, requesterRole);
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error: any) {
      if (error.message === "Discussion not found") {
        res.status(404).json({ error: error.message });
      } else if (error.message.startsWith("Forbidden")) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Failed to delete comment" });
      }
    }
  }
}
