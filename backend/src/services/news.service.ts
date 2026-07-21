import slugify from "slugify";
import { NewsRepository } from "@/repositories/news.repository";
import type { NewsQuery } from "@/repositories/news.repository";

interface CreateNewsInput {
  title: string;
  artikel: string;
  authorId: string;
  foto?: string;
  category?: string;
  tags?: string[];
}

interface UpdateNewsInput {
  title?: string;
  artikel?: string;
  foto?: string;
  category?: string;
  tags?: string[];
}

export class NewsService {
  private repository = new NewsRepository();

  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, locale: "id" });
  }

  async create(input: CreateNewsInput) {
    const { title, artikel, authorId, foto, category, tags } = input;

    const slug = this.generateSlug(title);

    // Ensure slug uniqueness by appending a timestamp if it already exists
    const existing = await this.repository.findBySlug(slug);
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    return this.repository.create({
      title,
      slug: finalSlug,
      artikel,
      foto,
      category,
      tags,
      author: authorId as any,
    });
  }

  async findByIdNoIncrement(id: string) {
    const news = await this.repository.findById(id);
    if (!news) throw new Error("News not found");
    return news;
  }

  async findAll(query: NewsQuery) {
    return this.repository.findAll(query);
  }

  async findById(id: string) {
    const news = await this.repository.findById(id);
    if (!news) throw new Error("News not found");
    // Increment views asynchronously (fire and forget)
    this.repository.incrementViews(id).catch(() => {});
    return news;
  }

  async findBySlug(slug: string) {
    const news = await this.repository.findBySlug(slug);
    if (!news) throw new Error("News not found");
    // Increment views asynchronously (fire and forget)
    this.repository.incrementViews((news._id as any).toString()).catch(() => {});
    return news;
  }

  async update(id: string, input: UpdateNewsInput) {
    const updateData: Partial<typeof input & { slug?: string }> = { ...input };

    if (input.title) {
      const slug = this.generateSlug(input.title);
      const existing = await this.repository.findBySlug(slug);
      const isSameDoc = existing && (existing._id as any).toString() === id;
      updateData.slug = isSameDoc || !existing ? slug : `${slug}-${Date.now()}`;
    }

    const news = await this.repository.findByIdAndUpdate(id, updateData as any);
    if (!news) throw new Error("News not found");
    return news;
  }

  async delete(id: string) {
    const news = await this.repository.findByIdAndDelete(id);
    if (!news) throw new Error("News not found");
    return news;
  }
}
