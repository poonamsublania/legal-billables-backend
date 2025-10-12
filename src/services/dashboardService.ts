import Billable from "../models/Billable";
import Client from "../models/Client";
import Draft from "../models/Draft";

export const getDashboardData = async () => {
  const billables = await Billable.find().sort({ date: -1 });
  const clients = await Client.find();
  const drafts = await Draft.find().sort({ createdAt: -1 });

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weeklyBillables = billables.filter(b => b.date > weekAgo);
  const totalHours = billables.reduce((sum, b) => sum + b.duration / 3600, 0);

  return {
    billables,
    clients,
    drafts,
    weeklyBillables,
    totalHours,
  };
};
