import { Request, Response } from "express";
import { logTimeEntry } from "../services/clioService";

export const createTimeEntry = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1]; // Bearer token
    if (!accessToken) return res.status(401).json({ error: "No access token" });

    const { matter_id, user_id, duration, description, date } = req.body;

    const timeEntry = await logTimeEntry(accessToken, {
      matter_id,
      user_id,
      duration,
      description,
      date
    });

    res.json({ success: true, timeEntry });
  } catch (error) {
    res.status(500).json({ error: "Failed to log time entry" });
  }
};
