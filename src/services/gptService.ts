import axios from "axios";

export const generateSummary = async (prompt: string) => {
  const response = await axios.post(
    "https://api.openai.com/v1/completions",
    {
      model: "text-davinci-003",
      prompt,
      max_tokens: 200,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GPT_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].text;
};
