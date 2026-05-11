import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

function getIndex() {
  if (!process.env.PINECONE_INDEX_NAME) {
    throw new Error("PINECONE_INDEX_NAME is missing in environment variables.");
  }

  const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

  if (process.env.PINECONE_NAMESPACE) {
    return index.namespace(process.env.PINECONE_NAMESPACE);
  }

  return index;
}

export async function queryPinecone(vector, topK = 5) {
  const index = getIndex();

  const result = await index.query({
    vector,
    topK,
    includeMetadata: true
  });

  return result.matches || [];
}

export async function upsertVectors(vectors) {
  if (!Array.isArray(vectors) || vectors.length === 0) {
    return;
  }

  const index = getIndex();
  const batchSize = 100;

  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await index.upsert(batch);
  }
}
