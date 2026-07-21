import { Schema, model, Types } from "mongoose";

export interface INews {
  title: string;
  slug: string;
  foto?: string;
  artikel: string;
  author: Types.ObjectId;
  category?: string;
  tags?: string[];
  views: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const newsSchema = new Schema<INews>(
  {
    title:    { type: String, required: true, trim: true },
    slug:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    foto:     { type: String, default: null },
    artikel:  { type: String, required: true },
    author:   { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, trim: true, default: null },
    tags:     { type: [String], default: [] },
    views:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index to speed up author lookups (slug index is auto-created by unique:true)
newsSchema.index({ author: 1 });

export default model<INews>("News", newsSchema);
