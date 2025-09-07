import fetch from "node-fetch";

const API_KEY = process.env.GEMINI_API_KEY!;
const URL = "https://generativelanguage.googleapis.com/v1beta/models";

(async () => {
  try {
    const res = await fetch(URL, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
      },
    });

    const data = await res.json();
    console.log("Available models:", data);
  } catch (err) {
    console.error("❌ Failed to list models:", err);
  }
})();
