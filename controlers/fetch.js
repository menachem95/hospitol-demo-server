import ping from "ping";
import { MongoClient } from "mongodb";
import * as fs from "fs";

export async function fetchPrinters(req, res, next) {
  // const printers = await fetch(
  //   "https://react-http-d33b4-default-rtdb.firebaseio.com/printers.json"
  // );

  // const responseData = await printers.json();
  // res.json(responseData)
  console.log("start");
  debugger;
  const uri =
    "mongodb+srv://m:ZBpLoaQ6UcHed5ho@cluster0.avjb12c.mongodb.net/hospital?retryWrites=true&w=majority";

  const client = await MongoClient.connect(uri);
  if (!client) {
    console.log("!client");
    return;
  }
  try {
    const database = client.db("hospital");
    const printers = database.collection("printers");
    const printers_find = await printers.find().toArray();

    let promises = [];
    let newPrinters = [];

    // promises = printers_find.map(async (printer) => {
    //   return await ping.promise.probe(printer.address);
    // });
    // let result = await Promise.all(promises);

    // for (let printer of printers_find) {
    //   newPrinters.push({
    //     ...printer,
    //     online: result.find((promise) => promise.inputHost === printer.address)
    //       .alive,
    //   });
    // }
    for (let printer of printers_find) {
      newPrinters.push({
        ...printer,
        online: Math.random() > 0.3 ? true : false.alive,
      });
    }

    console.log("end");

    res.json(newPrinters);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export async function fetchPrintersFromJson(req, res, next) {
  let printers = JSON.parse(
    fs.readFileSync("./printers/printers.json", "utf8")
  );
  let computers = JSON.parse(
    fs.readFileSync("./printers/computers.json", "utf8")
  );
  res.json([...printers, ...computers]);

  //   let obj;
  // fs.readFile(
  //     "./printers/printers.json",
  //     "utf8",
  //     function  (err, data) {
  //       if (err) throw err;
  //       obj = JSON.parse(data);
  //       console.log(obj);
  //       // res.json(obj)

  //     }
  //   );
  //   console.log("****************************************************************************************", obj)
  //   res.json(obj)
}
