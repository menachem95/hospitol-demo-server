import ping from "ping";
import { Log } from "../models/log.js";
import { Printer } from "../models/printer.js";

export async function checkPrintersNetwork({
  SIMULATION_MODE,
  isRefresh = false,
}) {
  const printers = await Printer.find({});
  try {
    let promises = [];
    let newLogs = [];

    promises = printers.map(async (printer) => {
      return await ping.promise.probe(printer.address);
    });
    let result = await Promise.all(promises);

    for (let printer of printers) {
      let date = new Date(); //.toLocaleTimeString();//.getTime() + 2 * 60 * 60 * 1000
      // console.log(date)

      newLogs.push({
        printer_id: printer._id,
        address: printer.address,
        date, //.substring(0, 16),
        isRefresh,
        online: SIMULATION_MODE
          ? Math.random() > 0.2
            ? true
            : false
          : result.find((promise) => promise.inputHost === printer.address)
              .alive
          ? true
          : false,
      });
    }

    newLogs.map((log) => {
      const newLog = new Log(log);
      newLog.save();
    });

    newLogs.map(async (log) => {
      await Printer.findByIdAndUpdate(log.printer_id, { online: log.online });
    });
    return await Printer.find();
  } catch (err) {
    console.log(err);
  }
}

function isPrinterOnline(address) {
  return new Promise((resolve, reject) => {
    ping.sys.probe(address, function (isAlive) {
      resolve(isAlive);
    });
  });
 
}

export async function checkOnePrinterNetwork({SIMULATION_MODE, address}) {
  if (SIMULATION_MODE)  return Math.random() > 0.2 ? true : false;
  {
    try {
      const isOnline = await isPrinterOnline(address);
      return isOnline;
    } catch (error) {
      console.error("Error checking printer status:", error);
      return false;
    }
  }
}
