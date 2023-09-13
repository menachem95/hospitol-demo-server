import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const { Schema } = mongoose;

const logsSchema = new Schema({
  printer_id: {
    type: ObjectId,
    ref: "printer",
    // required: true
  },
  address: {
    type: String,
    // required: true
  },
  log: {
    type: [{ time: { type: Object }, isOnline: { type: Boolean } }],
    // required: true
  },
});

export const Log = mongoose.model("log", logsSchema);
