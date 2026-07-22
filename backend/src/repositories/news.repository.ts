import News from "@/models/News";
import type { INews } from "@/models/News";

export interface NewsQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export class NewsRepository {
  async create(data: Partial<INews>) {
    return News.create(data);
  }

  async findAll(query: NewsQuery) {
    const { page = 1, limit = 10, category, search } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (category) filter["category"] = category;
    if (search) filter["title"] = { $regex: search, $options: "i" };

    const [data, total] = await Promise.all([
      News.find(filter)
        .populate("author", "username fullName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      News.countDocuments(filter),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  findById(id: string) {
    return News.findById(id).populate("author", "username fullName");
  }

  findBySlug(slug: string) {
    return News.findOne({ slug }).populate("author", "username fullName");
  }

  findByIdAndUpdate(id: string, data: Partial<INews>) {
    return News.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  incrementViews(id: string) {
    return News.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
  }

  findByIdAndDelete(id: string) {
    return News.findByIdAndDelete(id);
  }
}
