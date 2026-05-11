# RAG Express Backend API

This is a complete Express.js backend for your RAG application.

It connects:

```txt
Vercel React Frontend
        ↓
Express Backend API
        ↓
OpenAI Embeddings + Chat
        ↓
Pinecone Vector Database
```

## Included Endpoints

```txt
GET /health
POST /query
POST /upload
```

## Features

- Express.js API
- CORS support for Vercel
- OpenAI embedding generation
- OpenAI chat answer generation
- Pinecone vector search
- Pinecone vector upsert
- PDF, DOCX, TXT, CSV, MD, JSON text extraction
- File upload and indexing
- Environment variable guide

## Folder Structure

```txt
rag-express-backend/
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── uploads/
│   └── .gitkeep
└── src/
    ├── server.js
    ├── routes/
    │   ├── health.routes.js
    │   ├── query.routes.js
    │   └── upload.routes.js
    ├── services/
    │   ├── openai.service.js
    │   ├── pinecone.service.js
    │   ├── text.service.js
    │   └── file.service.js
    └── middleware/
        └── error.middleware.js
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill your real values:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

OPENAI_API_KEY=your_openai_api_key
OPENAI_CHAT_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
PINECONE_NAMESPACE=default
```

### 3. Run backend

```bash
npm run dev
```

Expected:

```txt
RAG backend running on port 5000
```

## Test Health

Open:

```txt
http://localhost:5000/health
```

Expected:

```json
{
  "status": "ok",
  "service": "rag-express-backend"
}
```

## API Documentation

### GET `/health`

Checks if API is running.

### POST `/query`

Request:

```json
{
  "query": "What is this document about?",
  "topK": 5
}
```

Response:

```json
{
  "answer": "The answer from the RAG system.",
  "sources": [
    {
      "id": "vector-id",
      "title": "document.pdf",
      "filename": "document.pdf",
      "text": "Relevant retrieved text",
      "score": 0.91,
      "page": null
    }
  ]
}
```

### POST `/upload`

Use form-data:

```txt
field name: file
```

Supported extensions:

```txt
.pdf
.docx
.txt
.csv
.md
.json
```

Response:

```json
{
  "success": true,
  "message": "File uploaded and indexed successfully.",
  "filename": "example.pdf",
  "chunks": 12
}
```

## Pinecone Setup

This backend defaults to:

```txt
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

This model uses:

```txt
Dimension: 1536
```

Your Pinecone index should use:

```txt
Metric: cosine
Dimension: 1536
```

If your existing Pinecone index uses another dimension, create a new compatible index or change the embedding model.

## Connect to Vercel Frontend

In Vercel frontend environment variables, set:

```txt
VITE_API_BASE_URL=https://your-backend-api-url.com
```

Do not put Pinecone or OpenAI keys in the frontend.

## Deploy Backend

### Render

```txt
Build Command: npm install
Start Command: npm start
```

Add all environment variables from `.env.example`.

### Railway

Deploy from GitHub and add all environment variables.

### AWS

Recommended options:

```txt
Simple: EC2 + PM2 + Nginx
Scalable: ECS Fargate + ALB
Serverless: Lambda + API Gateway
```

## CORS

For production, set:

```env
FRONTEND_URL=https://your-vercel-app.vercel.app
```

If testing multiple frontends, temporarily use:

```env
FRONTEND_URL=*
```

For production, use your exact frontend URL instead of `*`.

## Security

Never expose these in React/Vercel frontend:

```txt
OPENAI_API_KEY
PINECONE_API_KEY
Database passwords
Supabase service role key
```

Keep them only in backend environment variables.

## Common Errors

### Pinecone dimension mismatch

Your Pinecone index dimension does not match your embedding model.

Fix:

```txt
Use dimension 1536 for text-embedding-3-small.
```

### CORS blocked

Set:

```env
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Backend offline in frontend

Set this in your frontend Vercel environment variables:

```env
VITE_API_BASE_URL=https://your-backend-api-url.com
```

### No matches found

Possible causes:

- Pinecone index is empty
- Wrong namespace
- Wrong index name
- Uploaded documents were not indexed
- Question is unrelated to uploaded documents

## Recommended Next Steps

1. Upload backend to GitHub.
2. Deploy backend on Render, Railway, or AWS.
3. Add backend URL to Vercel frontend.
4. Upload a document.
5. Ask a question.
6. Check Pinecone vector count.
7. Add Supabase authentication later.
