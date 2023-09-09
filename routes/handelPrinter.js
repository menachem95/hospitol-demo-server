import { Router } from "express";
import { addPrinter, deletePrinter, updatePrinter } from "../controlers/handelPrinter.js";

const router = Router();

router.post("/add-printer", addPrinter);

router.delete("/delete-printer/:_id", deletePrinter);

router.put("/edit-printer", updatePrinter)

export default router;