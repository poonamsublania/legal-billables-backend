import axios from "axios";
import { Request, Response } from "express";
import ClioToken from "../models/ClioToken";

export const pushToClio = async (req: Request, res: Response) => {
  try {
    const {
      trackedTime,
      summary,
      subject,
      matterId,
      userId,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------
    if (!trackedTime || !summary || !subject || !matterId || !userId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // -----------------------------
    // Convert seconds → hours
    // -----------------------------
    const seconds =
      parseInt(String(trackedTime).replace("s", ""), 10) || 0;

    const hours = Math.max(seconds / 3600, 0.01);

    // -----------------------------
    // Get token from DB
    // -----------------------------
    const tokenDoc = await ClioToken.findOne({});

    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        error: "Clio token not found",
      });
    }

    // ✅ ONLY THIS — NO access_token ANYWHERE
    const accessToken = tokenDoc.accessToken;

    // -----------------------------
    // Clio payload
    // -----------------------------
    const payload = {
      data: {
        type: "TimeEntry",
        attributes: {
          quantity: Number(hours.toFixed(2)),
          note: `${subject}\n\n${summary}`,
        },
        relationships: {
          matter: {
            data: {
              type: "Matter",
              id: String(matterId),
            },
          },
          user: {
            data: {
              type: "User",
              id: String(userId),
            },
          },
        },
      },
    };

    // -----------------------------
    // Push to Clio
    // -----------------------------
    const clioRes = await axios.post(
      "https://app.clio.com/api/v4/time_entries",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({
      success: true,
      clio: clioRes.data,
    });
  } catch (err: any) {
    console.error(
      "❌ Clio push failed:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
};
