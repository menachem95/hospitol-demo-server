import ping from "ping";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import { Printer } from "./models/printer.js";

import fetchRoutes from "./routes/fetch.js";
import handelPrinter from "./routes/handelPrinter.js"

const MONGODB_URI =
// `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.avjb12c.mongodb.net/${process.env.MONGO_DATABASE}`;
 "mongodb+srv://m:ZBpLoaQ6UcHed5ho@cluster0.avjb12c.mongodb.net/hospital"
const app = express();

app.use((req, res, next) => {
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.options('*', cors());

app.use(cors({
  origin: "http://localhost:3000", // Vervang door de juiste oorsprong
  methods: "GET, POST, PUT, DELETE, OPTIONS", // Vervang door de toegestane methoden
  allowedHeaders: "Content-Type", // Vervang door de toegestane headers
  credentials: true, // Schakel cookies en verificatie in indien nodig
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json());

// app.post("/", (req, res, next) => {
//   console.log(typeof req.body.address);
//   ping.sys.probe(req.body.address, (isAlive) => {
//     res.json({ address: req.body.address, online: isAlive });
//   });
// });

// app.get("/fetch-printers", async (req, res, next) => {
//   const printers = await fetch(
//     "https://react-http-d33b4-default-rtdb.firebaseio.com/printers.json"
//   );

//   const responseData = await printers.json();
//   res.json(responseData)
// });



// app.post("/ping", async (req, res, next) => {
//   console.log(req.body)
//   const printers = req.body;
//   let promises = [];
//   let newPrinters = [];

//   promises = printers.map(async (printer) => {
//     return await ping.promise.probe(printer.address);
//   });
//   let result = await Promise.all(promises);

//   // for (let printer of printers) {
//   //   newPrinters.push({
//   //     address: printer.address,
//   //     type: printer.type,
//   //     online: result.find((promise) => promise.inputHost === printer.address)
//   //       .alive,
//   //   });
//   // }

//   for (let printer of printers) {
//     newPrinters.push({
//       address: printer.address,
//       type: printer.type,
//       online: Math.random() > 0.3 ? true : false
//         .alive,
//     });
//   }

//   console.log(newPrinters);
//   res.json(newPrinters);
// });

app.use(fetchRoutes);
app.use(handelPrinter);


mongoose
  .connect(MONGODB_URI)
  .then(app.listen(process.env.PORT || 8080))
  .catch((err) => {
    console.log(err);
  });
