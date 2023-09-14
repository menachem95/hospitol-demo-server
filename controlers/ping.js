import ping from "ping";
import { MongoClient } from "mongodb";
import { getTime } from "../utils/utils.js";
import { Log } from "../models/log.js";

export async function pingFromArray(printers) {
  console.log(printers)
  try {
    let promises = [];
    let newLogs = [];

    promises = printers.map(async (printer) => {
      return await ping.promise.probe(printer.address);
    });
    let result = await Promise.all(promises);

    for (let printer of printers) {
      newLogs.push({
        printer_id: printer._id,
        address: printer.address,
        time: getTime(),
        isOnline: result.find((promise) => promise.inputHost === printer.address)
          .alive,
      });
    }
    // ********************************************************************************
    // for (let log of logs) {
    //   newLogs.push({
    //     ...log,
    //     online: Math.random() > 0.3 ? true : false.alive,
    //   });
    // }

    newLogs.map((log) => {
      const newLog = new Log(log);
      newLog.save();
    });

    return newLogs;
  } catch (err) {
    console.log(err);
  }
}
