import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/health.routes.js";
import queryRoutes from "./routes/query.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const corsOrigin =
  FRONTEND_URL === "*"
    ? "*"
    : [FRONTEND_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: corsOrigin,
    credentials: true
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRoutes);
app.use("/query", queryRoutes);
app.use("/upload", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`RAG backend running on port ${PORT}`);
});
