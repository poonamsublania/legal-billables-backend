import axios from "axios";

export const createClioTimeEntry = async (
  accessToken: string,
  description: string,
  durationInSeconds: number,
  matterId: string
) => {
  const data = {
    data: {
      type: "TimeEntry",
      attributes: {
        description,
        duration: durationInSeconds,
        date: new Date().toISOString().split("T")[0],
        matter_id: 1719986897,
      },
    },
  };

  const response = await axios.post("https://app.clio.com/api/v4/time_entries", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
