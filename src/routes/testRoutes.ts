import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("✅ API is working!");
});

export default router;
