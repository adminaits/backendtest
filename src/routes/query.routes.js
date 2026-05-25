import express from "express";
import { generateAnswer } from "../services/openai.service.js";
import { createEmbedding } from "../services/embedding.service.js";
import { queryPinecone } from "../services/pinecone.service.js";


const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
const {
  query,
  topK = 10,
  filters = {}
} = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "Query is required and must be a string."
      });
    }

    const embedding = await createEmbedding(query);
    const matches = await queryPinecone(embedding, Number(topK));
    

    console.log("Pinecone matches found:", matches.length);
    console.log("First match:", JSON.stringify(matches[0], null, 2));

    const sources = matches.map((match) => ({
      id: match.id,
      score: match.score,
      title:
        match.metadata?.title ||
        match.metadata?.filename ||
        match.metadata?.subject ||
        "Untitled Source",
      filename: match.metadata?.filename || "",
      from: match.metadata?.from || "",
      subject: match.metadata?.subject || "",
      date: match.metadata?.date || "",
      source: match.metadata?.source || "",
      text: match.metadata?.text || "",
      chunkIndex:
        match.metadata?.chunk_index ??
        match.metadata?.chunkIndex ??
        null,
      page: match.metadata?.page || null
    }));

    const context = sources
      .map((source, index) => {
        return `
Source ${index + 1}
Score: ${source.score}
Filename: ${source.filename}
From: ${source.from}
Subject: ${source.subject}
Date: ${source.date}
Source Type: ${source.source}
Text:
${source.text}
`;
      })
      .join("\n\n");

    const answer = await generateAnswer({
      question: query,
      context
    });

    res.json({
      answer,
      sources,
      debug: {
        matchesFound: matches.length
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
