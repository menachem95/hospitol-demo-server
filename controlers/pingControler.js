import ping from "ping";
import { Log } from "../models/log.js";
import { Printer } from "../models/printer.js";

export async function checkPrintersNetwork({
  SIMULATION_MODE,
  isRefresh = false,
}) {
  console.log("isRefresh", isRefresh);
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
      new Log(log).save();
    });

    newLogs.map(async (log) => {
      await Printer.findByIdAndUpdate(log.printer_id, { online: log.online });
    });
    return await Printer.find();
    // return newLogs
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

export async function checkOnePrinterNetwork( SIMULATION_MODE, printer ) {
  const { _id, address } = printer;
  {
    try {
      const online = SIMULATION_MODE
        ? Math.random() > 0.2
          ? true
          : false
        : await isPrinterOnline(address);
      let date = new Date();
      new Log({
        online,
        address,
        date,
        isRefresh: true,
        printer_id: _id,
      }).save();
      return online;
    } catch (error) {
      console.error("Error checking printer status:", error);
      return false;
    }
  }
}
