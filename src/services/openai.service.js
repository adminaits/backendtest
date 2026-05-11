import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
const chatModel = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

export async function createEmbedding(input) {
  const response = await openai.embeddings.create({
    model: embeddingModel,
    input
  });

  return response.data[0].embedding;
}

export async function generateAnswer({ question, context }) {
  const systemPrompt = `
You are a helpful RAG assistant.
Answer only using the provided context.
If the context does not contain enough information, say that you do not have enough information.
Keep the answer clear and practical.
`;

  const userPrompt = `
Context:
${context || "No relevant context found."}

Question:
${question}
`;

  const response = await openai.chat.completions.create({
    model: chatModel,
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userPrompt
      }
    ],
    temperature: 0.2
  });

  return response.choices[0]?.message?.content || "No answer generated.";
}
