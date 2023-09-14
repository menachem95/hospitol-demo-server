import ping from "ping";
import { MongoClient } from "mongodb";
import {getTime} from "../utils/utils.js";
import { Log } from "../models/log.js";


export async function pingFromArray(logs) {
 
  try {
   

    let promises = [];
    let newLogs = [];

    promises = logs.map(async (log) => {
      return await ping.promise.probe(log.address);
    });
    let result = await Promise.all(promises);

    for (let log of logs) {
      newLogs.push({
        printer_id: log._id,
        log: {
          time: getTime(),
          isOnline: result.find((promise) => promise.inputHost === log.address)
          .alive,
        }
      
      });
    }
    // ********************************************************************************
    // for (let log of logs) {
    //   newLogs.push({
    //     ...log,
    //     online: Math.random() > 0.3 ? true : false.alive,
    //   });
    // }

    newLogs.map(log => {
      const newLog = new Log(log)
      newLog.save();
    })

    return newLogs

  } catch (err) {
    console.log(err);
  }
}

