import { Schema, model, Types } from "mongoose";

export interface IDiscussion {
  newsId: Types.ObjectId;
  userId: Types.ObjectId;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const discussionSchema = new Schema<IDiscussion>(
  {
    newsId:  { type: Schema.Types.ObjectId, ref: "News", required: true },
    userId:  { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Index to efficiently fetch all discussions for a specific news article
discussionSchema.index({ newsId: 1, createdAt: -1 });

export default model<IDiscussion>("Discussion", discussionSchema);
