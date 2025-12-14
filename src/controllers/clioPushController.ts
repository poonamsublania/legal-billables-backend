import { Request, Response } from "express";
import axios from "axios";
import ClioToken from "../models/ClioToken";

export const pushAddonToClio = async (req: Request, res: Response) => {
  try {
    const token = await ClioToken.findOne({ _id: "singleton" });
    if (!token) {
      return res.status(401).json({ success: false });
    }

    const seconds = parseInt(req.body.trackedTime.replace("s", ""));
    const hours = seconds / 3600;

    await axios.post(
      "https://app.clio.com/api/v4/activities",
      {
        type: "TimeEntry",
        quantity: hours,
        price: 0,
        description: req.body.summary,
      },
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Clio push failed:", err);
    res.status(500).json({ success: false });
  }
};
