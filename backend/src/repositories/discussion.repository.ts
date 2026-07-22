import Discussion from "@/models/Discussion";
import type { IDiscussion } from "@/models/Discussion";

export class DiscussionRepository {
  create(data: Partial<IDiscussion>) {
    return Discussion.create(data);
  }

  findByNewsId(newsId: string) {
    return Discussion.find({ newsId })
      .populate("userId", "username fullName")
      .sort({ createdAt: 1 }); // ascending: root dulu, replies di bawahnya secara kronologis
  }

  findById(id: string) {
    return Discussion.findById(id);
  }

  findByIdAndDelete(id: string) {
    return Discussion.findByIdAndDelete(id);
  }
}
