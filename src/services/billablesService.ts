import Billable, { IBillable } from "../models/Billable";

// Create billable
export const createBillable = async (data: Partial<IBillable>) => {
  const billable = new Billable(data);
  return await billable.save();
};

// Get all billables
export const getBillables = async () => {
  return await Billable.find().sort({ date: -1 });
};

// Update billable
export const updateBillable = async (id: string, data: Partial<IBillable>) => {
  return await Billable.findByIdAndUpdate(id, data, { new: true });
};

// Delete billable
export const deleteBillable = async (id: string) => {
  await Billable.findByIdAndDelete(id);
  return { message: "Billable deleted" };
};
