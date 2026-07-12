import express from "express";
import cors from "cors";
import authRoutes from "@/routes/auth.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);

// General error-handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
