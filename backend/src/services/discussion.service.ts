import { DiscussionRepository } from "@/repositories/discussion.repository";
import { NewsRepository } from "@/repositories/news.repository";

interface CreateDiscussionInput {
  newsId: string;
  userId: string;
  comment: string;
  parentId?: string | null;
}

export class DiscussionService {
  private repository = new DiscussionRepository();
  private newsRepository = new NewsRepository();

  async create(input: CreateDiscussionInput) {
    const { newsId, userId, comment, parentId } = input;

    // Validate the referenced news article exists
    const news = await this.newsRepository.findById(newsId);
    if (!news) throw new Error("News article not found");

    if (!comment || comment.trim().length === 0) {
      throw new Error("Comment cannot be empty");
    }

    // Validate parentId if provided
    if (parentId) {
      const parent = await this.repository.findById(parentId);
      if (!parent) throw new Error("Parent comment not found");
    }

    return this.repository.create({
      newsId: newsId as any,
      userId: userId as any,
      comment: comment.trim(),
      parentId: parentId ? (parentId as any) : null,
    });
  }

  async findByNewsId(newsId: string) {
    // Validate the referenced news article exists
    const news = await this.newsRepository.findById(newsId);
    if (!news) throw new Error("News article not found");

    return this.repository.findByNewsId(newsId);
  }

  async delete(discussionId: string, requesterId: string, requesterRole: string) {
    const discussion = await this.repository.findById(discussionId);
    if (!discussion) throw new Error("Discussion not found");

    const isOwner = discussion.userId.toString() === requesterId;
    const isAdmin = requesterRole === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("Forbidden: You are not allowed to delete this comment");
    }

    return this.repository.findByIdAndDelete(discussionId);
  }
}
