import axios from "axios";
import ClioTokenModel, { IClioToken } from "../models/clioToken";

/**
 * Get Clio access token from DB
 */
export const getClioToken = async (): Promise<string | null> => {
  const tokenDoc = (await ClioTokenModel.findOne({ _id: "singleton" })) as IClioToken;
  if (!tokenDoc) {
    console.error("[ClioService] No token found in DB");
    return null;
  }
  console.log("[ClioService] Retrieved access token from DB");
  return tokenDoc.accessToken;
};

/**
 * Push time entry to Clio API
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
        ...(userId ? { user_id: userId } : {}),
      },
    },
  };

  console.log("[ClioService] Sending payload to Clio:", JSON.stringify(data, null, 2));

  try {
    const response = await axios.post("https://app.clio.com/api/v4/time_entries", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("[ClioService] Clio response:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("[ClioService] Failed to push time entry:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error || err.message || "Failed to push time entry to Clio");
  }
};
