import ping from "ping";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
// import socket from "socket.io";
import { Server } from "socket.io";

import { Printer } from "./models/printer.js";

import logRoutes from "./routes/logRoutes.js";
import fetchRoutes from "./routes/fetch.js";
import handelPrinter from "./routes/handelPrinter.js";

import {
  checkPrintersNetwork,
  checkOnePrinterNetwork,
} from "./controlers/ping.js";
import { Log } from "./models/log.js";
dotenv.config();
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.avjb12c.mongodb.net/${process.env.MONGO_DATABASE}`;
const app = express();
// app.use(bodyParser.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

let printers = [];

const getPrinters = async () => {
  const time = new Date().toLocaleTimeString();
  console.log(`Task started at ${time}`);
  printers = await checkPrintersNetwork();
  io.emit("send-printers", printers, new Date().toLocaleString().split(" ")[1]);
};

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.options("*", cors());

// app.use(cors({
//   origin: "http://localhost:3000", // Vervang door de juiste oorsprong
//   methods: "GET, POST, PUT, DELETE, OPTIONS", // Vervang door de toegestane methoden
//   allowedHeaders: "Content-Type", // Vervang door de toegestane headers
//   credentials: true, // Schakel cookies en verificatie in indien nodig
//   optionsSuccessStatus: 200
// }));

app.use(bodyParser.json());

let intervalMinutes = 0.5;

let intervalId;
const startInterval = () => {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    console.log("intervalMinutes:", intervalMinutes);
    getPrinters();
  }, intervalMinutes * 60 * 1000);
};

startInterval();

app.post("/setinterval", (req, res) => {
  intervalMinutes = req.body.intervalMinutes;
  startInterval();
  res
    .status(200)
    .json({ intervalMinutes, message: "Interval set successfully." });
});

io.on("connection", (socket) => {
  socket.on("refresh", async (cb) => {
    const printers = await checkPrintersNetwork(true);

    cb(printers, new Date().toLocaleString().split(" ")[1]);
  });
  socket.on("update-printres", async (event, printer, checkPing = true) => {
    let online = printer.online;
    let newPrinter = { ...printer };
    console.log("printer: ", printer);
    if (event === "delete") {
      await Printer.findByIdAndDelete(printer._id);
    } else if (checkPing) {
      online = await checkOnePrinterNetwork(printer.address);
    }

    if (event === "update") {
      newPrinter = await Printer.findByIdAndUpdate(
        printer._id,
        { ...printer, online },
        {
          new: true,
        }
      );
    } else if (event === "add") {
      newPrinter = await Printer.create({ ...printer, online });
    }

    console.log("newPrinter:", newPrinter);
    io.emit("update-printres", event, newPrinter);
  });
  socket.on("onePing", async (printer) => {
    const online = await checkOnePrinterNetwork(printer.address);
    io.emit("update-printres", "update", { ...printer, online });
  });
});

// let printers_find = [];

// const client = await MongoClient.connect(MONGODB_URI);
// if (!client) {
//   console.log("!client");
// }
// try {
//   const database = client.db("hospital");
//   const printers = database.collection("printers");
//   printers_find = await printers.find().toArray();
// } catch (err) {
//   console.log(err);
// } finally {
//   client.close();
// }

// const getPrinters = async () => {

//   console.log(printers.length);
// };

// const printers = getPrinters();

// setInterval(async () => {
//   const currentTime = new Date();
//   console.log(`Task started at ${currentTime}`);
//   // const printers = await Printer.find({});
//   // checkPrintersNetwork(printers);
//   checkPrintersNetwork()
// }, 1 * 60 * 1000);

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

app.use(logRoutes);
app.use(fetchRoutes);
app.use(handelPrinter);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("connected to mongoDB!");
  } catch (error) {
    throw error;
  }
};
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!");
});

server.listen(8080, () => {
  connectDB();
  console.log("listening on 8080");
});
