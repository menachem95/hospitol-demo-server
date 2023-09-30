import ping from "ping";
import { MongoClient } from "mongodb";
import { getTime } from "../utils/utils.js";
import { Log } from "../models/log.js";
import { Printer } from "../models/printer.js";

export async function checkPrintersNetwork(isRefresh) {
  const printers = await Printer.find({});
  // console.log(printers);
  console.log(new Date().toLocaleString().split(" ")[1]);
  try {
    let promises = [];
    let newLogs = [];

    promises = printers.map(async (printer) => {
      return await ping.promise.probe(printer.address);
    });
    let result = await Promise.all(promises);

    if (isRefresh) {
      let tempPrinters = [];
      for (let printer of printers) {
        tempPrinters.push({
          ...printer._doc,
          online: 
          // result.find(
          //   (promise) => promise.inputHost === printer.address
          // ).alive
          //   ? true
          //   : false,
          Math.random() > 0.3 ? true : false,
        });
      }

      // console.log("tempPrinters:", tempPrinters);
      return tempPrinters;
    } else {
      for (let printer of printers) {
        newLogs.push({
          printer_id: printer._id,
          address: printer.address,
          time: getTime(),
          online:
          //  result.find(
          //   (promise) => promise.inputHost === printer.address
          // ).alive
          //   ? true
          //   : false,
          Math.random() > 0.3 ? true : false,
        });
      }
      // ********************************************************************************

      // for (let printer of printers) {
      //   newLogs.push({
      //     printer_id: printer._id,
      //     address: printer.address,
      //     time: getTime(),
      //     online: Math.random() > 0.5 ? true : false,
      //   });
      // }

      newLogs.map((log) => {
        const newLog = new Log(log);
        newLog.save();
      });

      newLogs.map(async (log) => {
        // console.log(log);
        await Printer.findByIdAndUpdate(log.printer_id, { online: log.online });
      });
      return await Printer.find();
    }
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
  // return false;
}

export async function checkOnePrinterNetwork(address) {
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
