import { Router } from "express";
import { addPrinter, DeletePrinter } from "../controlers/handelPrinter.js";

const router = Router();

router.post("/add-printer", addPrinter);

router.delete("/delete-printer/:pag", DeletePrinter);

export default router;