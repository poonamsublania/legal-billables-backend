import cron from "node-cron";
import Reminder from "../models/Reminder";
import { sendPush } from "../services/reminderService";

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const reminders = await Reminder.find({
      sent: false,
      remindAt: { $lte: now },
    });

    for (const reminder of reminders) {
      if (!reminder.expoPushToken) {
        console.warn(
          `⚠️ Reminder ${reminder._id} has no expoPushToken`
        );
        continue;
      }

      await sendPush(reminder.expoPushToken, reminder.message);

      console.log("🔔 PUSH SENT:", reminder.message);

      reminder.sent = true;
      await reminder.save();
    }
  } catch (err) {
    console.error("❌ Reminder cron failed:", err);
  }
});
