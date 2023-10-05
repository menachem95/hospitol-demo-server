import { getTime } from "../utils/utils.js";
import { Log } from "../models/log.js";
import { Printer } from "../models/printer.js";

export async function getPrinterLogs(req, res, next) {
  // const printer_id = req.params.printer;
  // const currentDate = new Date();
  // let gte_date;
  // let lt_date;

  // const time = req.params.time;
  // // if (+time) {
  // //   gte_date = Date.setDate(currentDate.getDate() - +time)
  // // } else {
  // // }

  // const yesterday = new Date();
  // yesterday.setDate(currentDate.getDate() - 1);

  // const startOfToday = new Date();
  // startOfToday.setHours(0, 0, 0, 0);

  // const logs = await Log.find({
  //   printer_id,

  //   date: {
  //     $gte: gte_date,
  //     $lt: lt_date,
  //   },
  // });
  
  const printer_id = req.params.printer;
  const logs = await Log.find({
    printer_id,
  }).populate("printer_id");
  console.log(logs);
  res.json(logs);
}
