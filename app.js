import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import { Printer } from "./models/printer.js";

import logRoutes from "./routes/logRoutes.js";
import fetchRoutes from "./routes/fetch.js";
import handelPrinter from "./routes/handelPrinter.js";

import {
  checkPrintersNetwork,
  checkOnePrinterNetwork,
} from "./controlers/pingControler.js";
import { Log } from "./models/log.js";
// process.env.TZ = 'Europe/Jerusalem';
dotenv.config();
const SIMULATION_MODE = Boolean(process.env.SIMULATION_MODE)
console.log("SIMULATION_MODE:", SIMULATION_MODE)
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.avjb12c.mongodb.net/${process.env.MONGO_DATABASE}`;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

let printers = [];

const getPrinters = async () => {
  const time = new Date().toLocaleTimeString();
  console.log(`Task started at ${time}`);
  printers = await checkPrintersNetwork({SIMULATION_MODE});
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

let intervalMinutes = 5;

let lastFunctionCallTime = new Date();


let intervalId;
const startInterval = () => {
  if (intervalId) clearInterval(intervalId);
  lastFunctionCallTime = new Date();
  intervalId = setInterval(() => {
    console.log("intervalMinutes:", intervalMinutes);
    getPrinters();
  }, intervalMinutes * 60 * 1000);
};

startInterval();

app.post("/setinterval", (req, res) => {
  intervalMinutes = req.body.intervalMinutes;
  console.log("get new interval: ", intervalMinutes);

  res.status(200).json({
    intervalMinutes,
    message: `Interval set successfully. ${intervalMinutes}`,
  });
  startInterval();
});

app.get("/server-confing", (req, res) => {
  res.json({ intervalMinutes });
});

io.on("connection", (socket) => {
  socket.on("refresh", async (cb) => {
    // lastFunctionCallTime = new Date();
    
    let currentTime = new Date();
    const timeDiffInSeconds = (currentTime - lastFunctionCallTime) / 1000;
    console.log("timeDiffInSeconds", timeDiffInSeconds)
    if (timeDiffInSeconds > 30) {
      printers = await checkPrintersNetwork({SIMULATION_MODE, isRefresh: true});
      lastFunctionCallTime = new Date();
    } 

    io.emit("send-printers", printers, new Date().toLocaleString().split(" ")[1]);
    // cb(printers, new Date().toLocaleString().split(" ")[1]);
  });
  socket.on("update-printres", async (event, printer, checkPing = true) => {
    let online = printer.online;
    const address = printer.address;
    let newPrinter = { ...printer };
    console.log("printer: ", printer);
    if (event === "delete") {
      await Printer.findByIdAndDelete(printer._id);
    } else if (checkPing) {
      online = await checkOnePrinterNetwork({SIMULATION_MODE, address});
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
    const online = await checkOnePrinterNetwork({SIMULATION_MODE, printer});
    io.emit("update-printres", "update", { ...printer, online });
  });
});

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
mongoose.set("strictQuery", false);
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
