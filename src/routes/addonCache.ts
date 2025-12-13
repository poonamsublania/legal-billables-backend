import express from "express";

const router = express.Router();

// TEMP memory store (OK for now)
const addonCache: Record<string, any> = {};

router.post("/addon-cache", (req, res) => {
  const { messageId, trackedTime, summary, email } = req.body;

  addonCache[messageId] = {
    trackedTime,
    summary,
    email
  };

  return res.json({ success: true });
});

router.get("/addon-cache/:messageId", (req, res) => {
  const data = addonCache[req.params.messageId];
  return res.json(data || {});
});

export default router;
