import { Log } from "../models/log.js";
import { Printer } from "../models/printer.js";

export async function getPrinterLogs(req, res, next) {
  const printer_id = req.params.printer_id;

  const start =
    // new Date(
    req.query.start;
  // );
  const end =
    // new Date(
    req.query.end;
  // );

  console.log("start:", start);
  console.log("end:", end);

  const logs = await Log.find({
    printer_id,
    date: {
      $gte: start,
      $lte: end,
    },
    $or: [{ isRefresh: { $exists: false } }, { isRefresh: { $eq: false } }],
  }).sort({ date: 1 });
  // .populate("printer_id");
  console.log(logs);
  res.json(logs);
}
