import ping from "ping";
import { MongoClient } from "mongodb";
import { getTime } from "../utils/utils.js";
import { Log } from "../models/log.js";
import { Printer } from "../models/printer.js";

export async function pingFromArray() {
  const printers = await Printer.find({});
  console.log(printers);
  try {
    let promises = [];
    let newLogs = [];

    promises = printers.map(async (printer) => {
      return await ping.promise.probe(printer.address);
    });
    let result = await Promise.all(promises);

    // for (let printer of printers) {
    //   newLogs.push({
    //     printer_id: printer._id,
    //     address: printer.address,
    //     time: getTime(),
    //     online: result.find((promise) => promise.inputHost === printer.address)
    //       .alive,
    //   });
    // }
    // ********************************************************************************
    for (let printer of printers) {
      newLogs.push({
        printer_id: printer._id,
        address: printer.address,
        time: getTime(),
        online: Math.random() > 0.5 ? true : false,
      });
    }

    newLogs.map((log) => {
      const newLog = new Log(log);
      newLog.save();
    });

    newLogs.map(async (log) => {
      console.log(log)
      await Printer.findByIdAndUpdate(log.printer_id, { online: log.online });
    });

    // return newLogs;
  } catch (err) {
    console.log(err);
  }
}
