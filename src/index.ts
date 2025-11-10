// backend/src/index.ts
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Mock "email send" endpoint
let emailEntries: any[] = [];

app.post("/api/emails", (req, res) => {
  const { subject, clientEmail, date, trackedTime, status } = req.body;
  const newEmail = {
    id: emailEntries.length + 1,
    subject,
    clientEmail,
    date,
    trackedTime,
    status,
  };
  emailEntries.push(newEmail);
  res.status(201).json(newEmail);
});

// Get all emails
app.get("/api/emails", (req, res) => {
  res.json(emailEntries);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
