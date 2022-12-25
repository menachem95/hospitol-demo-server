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
    "mongodb+srv://m:ZBpLoaQ6UcHed5ho@cluster0.avjb12c.mongodb.net/hospitol?retryWrites=true&w=majority";

  const client = await MongoClient.connect(uri);
  if (!client) {
    console.log("!client");
    return;
  }
  try {
    const database = client.db("hospitol");
    const printers = database.collection("printers");
    const printers_find = await printers.find().toArray();
    console.log("end");
    // console.log(printers_find);
    // console.log(printers_find.length);
    res.json(printers_find);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

export async function fetchPrintersFromJson(req, res, next) {

  let printers = JSON.parse(fs.readFileSync('./printers/printers.json', 'utf8'));
  let computers = JSON.parse(fs.readFileSync('./printers/computers.json', 'utf8'));
  res.json([...printers, ...computers])


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
