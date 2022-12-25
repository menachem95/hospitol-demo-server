import { Router } from "express";
import { addPrinter } from "../controlers/handelPrinter.js";

const router = Router();

router.post("/add-printer", addPrinter);

export default router;