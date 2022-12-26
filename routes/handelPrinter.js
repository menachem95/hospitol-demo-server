import express from "./package/express/index.js";
import { addPrinter } from "../controlers/handelPrinter.js";

const router = express.Router();

router.post("/add-printer", addPrinter);

export default router;