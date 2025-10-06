// src/services/clioService.ts
import axios from "axios";
import ClioTokenModel from "../models/clioToken";

const CLIO_BASE_URL = "https://app.clio.com";

export const getClioToken = async (): Promise<string | null> => {
  const tokenDoc = await ClioTokenModel.findOne();
  if (!tokenDoc?.clioAccessToken) {
    console.error("[ClioService] ❌ No Clio token found in DB");
    return null;
  }

  return tokenDoc.clioAccessToken;
};

export const logTimeEntry = async (
  accessToken: string,
  billableData: {
    description: string;
    durationInSeconds: number;
    date: string;
    matterId: string;
  }
) => {
  try {
    const payload = {
      data: {
        type: "time_entries",
        attributes: {
          note: billableData.description,
          date: billableData.date,
          quantity: billableData.durationInSeconds / 3600,
          billable: true,
        },
        relationships: {
          matter: {
            data: {
              id: billableData.matterId,
              type: "matters",
            },
          },
        },
      },
    };

    const response = await axios.post(`${CLIO_BASE_URL}/api/v4/time_entries`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("[ClioService] ❌ Clio API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to log time entry");
  }
};
