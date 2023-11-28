import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const { Schema } = mongoose;

const logsSchema = new Schema(
  {
    date: {
      type: Date,
      //  default: Date.now,
    },
    printer_id: {
      type: ObjectId,
      ref: "Printer",
      // required: true
    },
  
    address: {
      type: String,
      // required: true
    },
    // time: { type: Object },
    online: { type: Boolean, default: false },
  }
  // {
  //   timestamps: true,
  // }
);

export const Log = mongoose.model("log", logsSchema);
