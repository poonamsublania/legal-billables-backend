"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBillable = exports.updateBillable = exports.getBillables = exports.createBillable = void 0;
const Billable_1 = __importDefault(require("../models/Billable"));
// Create billable
const createBillable = async (data) => {
    const billable = new Billable_1.default(data);
    return await billable.save();
};
exports.createBillable = createBillable;
// Get all billables
const getBillables = async () => {
    return await Billable_1.default.find().sort({ date: -1 });
};
exports.getBillables = getBillables;
// Update billable
const updateBillable = async (id, data) => {
    return await Billable_1.default.findByIdAndUpdate(id, data, { new: true });
};
exports.updateBillable = updateBillable;
// Delete billable
const deleteBillable = async (id) => {
    await Billable_1.default.findByIdAndDelete(id);
    return { message: "Billable deleted" };
};
exports.deleteBillable = deleteBillable;
