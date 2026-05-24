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

Your job is to answer questions using ONLY the resume context provided.

Rules:
1. Do not invent candidates, skills, experience, emails, phone numbers, or qualifications.
2. If the resume context does not contain enough information, say:
   "The available resume database does not contain enough information."
3. Extract useful recruitment details when available:
   - Candidate name
   - Email
   - Phone number
   - Job title
   - Years of experience
   - Skills
   - Education
   - Certifications
   - Location
   - Resume filename
4. When listing candidates, use a clear numbered list.
5. When ranking candidates, explain briefly why each candidate is relevant.
6. Keep answers concise, practical, and recruiter-friendly.
7. Do not mention Pinecone, embeddings, vectors, or internal system details.
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
