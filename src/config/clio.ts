// src/config/clio.ts
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const CLIO_BASE_URL = "https://app.clio.com";
const API_BASE_URL = "https://app.clio.com/api/v4";

/**
 * Helper: Pretty print API errors
 */
function logAxiosError(error: unknown, context: string) {
  if (axios.isAxiosError(error)) {
    console.error(`🔴 ${context}:`, error.response?.data || error.message);
  } else {
    console.error(`🔴 ${context}:`, error);
  }
}

/**
 * Exchange authorization code for access & refresh tokens
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
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return response.data; // { access_token, refresh_token, expires_in, token_type }
  } catch (error) {
    logAxiosError(error, "Failed to get Clio access token");
    throw error;
  }
}

/**
 * Refresh an expired Clio access token
 */
export async function refreshClioToken(refreshToken: string) {
  try {
    const response = await axios.post(
      `${CLIO_BASE_URL}/oauth/token`,
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.CLIO_CLIENT_ID!,
        client_secret: process.env.CLIO_CLIENT_SECRET!,
        refresh_token: refreshToken,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return response.data; // { access_token, refresh_token, expires_in, token_type }
  } catch (error) {
    logAxiosError(error, "Failed to refresh Clio token");
    throw error;
  }
}

/**
 * Create a time entry in Clio
 * Note: `duration` must be in SECONDS
 */
export async function createClioTimeEntry(
  accessToken: string,
  data: { description: string; duration: number; matter_id: string }
) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/time_entries`,
      {
        description: data.description,
        duration: data.duration, // seconds
        matter_id: data.matter_id,
        billable: true,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return response.data;
  } catch (error) {
    logAxiosError(error, "Failed to create Clio time entry");
    throw error;
  }
}

/**
 * Fetch list of matters for logged-in user
 */
export async function getClioMatters(accessToken: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/matters`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  } catch (error) {
    logAxiosError(error, "Failed to fetch Clio matters");
    throw error;
  }
}
