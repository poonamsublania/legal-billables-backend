import express, { Request, Response } from "express";
import axios from "axios";
import Token from "../models/ClioToken";

const router = express.Router();

router.get("/test", async (req: Request, res: Response) => {
  try {
    const tokenDoc = await Token.findById("singleton");
    if (!tokenDoc) {
      return res.status(400).json({ error: "No Clio token found" });
    }

    const response = await axios.get(
      "https://app.clio.com/api/v4/users/who_am_i",
      {
        headers: {
          Authorization: `Bearer ${tokenDoc.accessToken}`,
        },
      }
    );

    return res.json({
      message: "Clio API is Working!",
      user: response.data.data, // ← contains the logged-in user
    });
  } catch (err: any) {
    console.error("Clio API Error:", err?.response?.data || err);

    return res.status(500).json({
      error: "Failed to call Clio API",
      details: err?.response?.data || err?.message,
    });
  }
});

export default router;
