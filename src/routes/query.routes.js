import express from "express";
import { createEmbedding, generateAnswer } from "../services/openai.service.js";
import { queryPinecone } from "../services/pinecone.service.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { query, topK = 5 } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "Query is required and must be a string."
      });
    }

    const embedding = await createEmbedding(query);
    const matches = await queryPinecone(embedding, Number(topK));

    const sources = matches.map((match) => ({
      id: match.id,
      score: match.score,
      title: match.metadata?.title || match.metadata?.filename || "Untitled Source",
      filename: match.metadata?.filename || "",
      text: match.metadata?.text || "",
      page: match.metadata?.page || null
    }));

    const context = sources
      .map((source, index) => `Source ${index + 1}: ${source.text}`)
      .join("\n\n");

    const answer = await generateAnswer({
      question: query,
      context
    });

    res.json({
      answer,
      sources
    });
  } catch (error) {
    next(error);
  }
});

export default router;
