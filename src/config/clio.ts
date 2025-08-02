import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const CLIO_BASE_URL = "https://app.clio.com";
const API_BASE_URL = "https://app.clio.com/api/v4";

/**
 * Exchange authorization code for access token
 */
export async function getClioAccessToken(code: string) {
  try {
    const response = await axios.post(
      `${CLIO_BASE_URL}/oauth/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.CLIO_CLIENT_ID!,
        client_secret: process.env.CLIO_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.CLIO_REDIRECT_URI!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data; // returns access_token, refresh_token, etc.
  } catch (error) {
    console.error("🔴 Failed to get Clio access token:", error);
    throw error;
  }
}

/**
 * Create a time entry in Clio
 */
export async function createClioTimeEntry(
  accessToken: string,
  data: {
    description: string;
    duration: number;
    matter_id: string;
  }
) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/time_entries`,
      {
        description: data.description,
        duration: data.duration,
        matter_id: data.matter_id,
        billable: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("🔴 Failed to create Clio time entry:", error);
    throw error;
  }
}

/**
 * Get list of matters for the logged-in user
 */
export async function getClioMatters(accessToken: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/matters`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("🔴 Failed to fetch Clio matters:", error);
    throw error;
  }
}
