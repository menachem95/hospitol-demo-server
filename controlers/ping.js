import ping from "ping";
import { MongoClient } from "mongodb";
import {getTime} from "../utils/utils.js";
import { Log } from "../models/log.js";


export async function pingFromArray(logs) {
 
  try {
   

    let promises = [];
    let newlogs = [];

    promises = logs.map(async (log) => {
      return await ping.promise.probe(log.address);
    });
    let result = await Promise.all(promises);

    for (let log of logs) {
      newlogs.push({
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
    //   newlogs.push({
    //     ...log,
    //     online: Math.random() > 0.3 ? true : false.alive,
    //   });
    // }

    newlogs.map(log => {
      const newLog = new Log(log)
      newLog.save();
    })

    return newlogs

  } catch (err) {
    console.log(err);
  }
}

