import express from "express";
import multer from "multer";
import path from "path";
import { extractTextFromFile } from "../services/file.service.js";
import { chunkText } from "../services/text.service.js";
import { createEmbedding } from "../services/openai.service.js";
import { upsertVectors } from "../services/pinecone.service.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

router.post("/", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded. Use form-data field name: file."
      });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const extension = path.extname(originalName).toLowerCase();

    const extractedText = await extractTextFromFile(filePath, extension);

    if (!extractedText || extractedText.trim().length < 10) {
      return res.status(400).json({
        error: "Could not extract enough text from this file."
      });
    }

    const chunks = chunkText(extractedText, {
      chunkSize: 1000,
      overlap: 150
    });

    const vectors = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await createEmbedding(chunk);

      vectors.push({
        id: `${req.file.filename}-chunk-${i}`,
        values: embedding,
        metadata: {
          filename: originalName,
          title: originalName,
          chunkIndex: i,
          text: chunk
        }
      });
    }

    await upsertVectors(vectors);

    res.json({
      success: true,
      message: "File uploaded and indexed successfully.",
      filename: originalName,
      chunks: chunks.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;
