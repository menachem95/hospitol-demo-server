import { getTime } from "../utils/utils.js";
import { Log } from "../models/log.js";
import { Printer } from "../models/printer.js";

export async function getPrinterLogs(req, res, next) {
  
  const printer_id = req.params.printer;

  // const currentDate = new Date();

  // const thirtyDaysAgo = new Date();
  // thirtyDaysAgo.setDate(currentDate.getDate() - 30);

   const start =
    // new Date(
    req.params.start
    // );
  const end = 
  // new Date(
    req.params.end
    // );

  console.log("start:", start);
  console.log("end:", end);

  const logs = await Log.find({
    printer_id,
    date: {
      $gte: start,
      $lte: end,
    },
  }).sort({ date: 1 });
  // .populate("printer_id");
  console.log(logs);
  res.json(logs);
}
