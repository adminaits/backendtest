import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "rag-express-backend"
  });
});

export default router;
