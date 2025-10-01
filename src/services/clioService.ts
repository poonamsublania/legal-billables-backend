// src/services/clioService.ts
import axios from "axios";
import ClioTokenModel, { IClioToken } from "../models/clioToken";

/**
 * Get Clio access token from DB
 */
export const getClioToken = async (): Promise<string | null> => {
  const tokenDoc = await ClioTokenModel.findOne({ _id: "singleton" }) as IClioToken;
  if (!tokenDoc) return null;
  return tokenDoc.accessToken;
};

/**
 * Push time entry to Clio API
 * @param accessToken Clio API access token
 * @param payload Object containing: description, duration, date, matterId, userId
 */
export const logTimeEntry = async (
  accessToken: string,
  payload: {
    description: string;
    duration: number;
    date: string;
    matterId: string;
    userId?: string;
  }
) => {
  const { description, duration, date, matterId, userId } = payload;

  const data = {
    data: {
      type: "TimeEntry",
      attributes: {
        description,
        duration,
        date,
        matter_id: matterId,
        user_id: userId || undefined,
      },
    },
  };

  try {
    const response = await axios.post("https://app.clio.com/api/v4/time_entries", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err: any) {
    console.error("[ClioService] Error pushing time entry:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error || "Failed to push time entry to Clio");
  }
};
