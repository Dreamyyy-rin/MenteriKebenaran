import express from "express";
import cors from "cors";
import authRoutes from "@/routes/auth.route";
import newsRoutes from "@/routes/news.route";
import discussionRoutes, { discussionDeleteRouter } from "@/routes/discussion.route";
import uploadRoutes from "@/routes/upload.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/upload", uploadRoutes);

// Nested: GET /api/news/:newsId/discussions  and  POST /api/news/:newsId/discussions
app.use("/api/news/:newsId/discussions", discussionRoutes);

// DELETE /api/discussions/:id
app.use("/api/discussions", discussionDeleteRouter);

// General error-handling middleware (must be last)
app.use((err: any, req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
