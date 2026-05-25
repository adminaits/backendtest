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
You are an AI Resume Search Assistant for recruiters.

Use ONLY the provided resume context to answer the recruiter question.

Rules:
1. Do not invent candidates, emails, phone numbers, experience, skills, or qualifications.
2. If the resume context does not contain enough information, say:
   "The available resume database does not contain enough information."
3. When listing candidates, provide:
   - Candidate name
   - Email if available
   - Relevant role/skill match
   - Short reason for relevance
4. When ranking candidates, rank by:
   - Role relevance
   - Skills match
   - Experience relevance
   - Education/certification relevance
5. Keep answers concise, recruiter-friendly, and structured.
6. Do not mention Pinecone, vectors, embeddings, metadata, or internal backend details.
7. If the question asks for a list, use a numbered list.
`;

  const userPrompt = `
Resume Context:
${context || "No resume context found."}

Recruiter Question:
${question}
`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
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
