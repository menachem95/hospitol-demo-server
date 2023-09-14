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
  time: { type: Object },
  isOnline: { type: Boolean },
  
});

export const Log = mongoose.model("log", logsSchema);
