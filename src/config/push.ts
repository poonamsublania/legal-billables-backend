import { Expo } from "expo-server-sdk";

if (!process.env.EXPO_PUSH_KEY) {
  console.warn(
    "⚠️ EXPO_PUSH_KEY is not set. Push notifications will not work."
  );
}

export const expo = new Expo({
  accessToken: process.env.EXPO_PUSH_KEY,
});
