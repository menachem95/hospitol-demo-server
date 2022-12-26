import { Router } from "express";
import { fetchPrinters, fetchPrintersFromJson } from "../controlers/fetch.js";

const router = Router();

router.get("/fetch-printers", fetchPrinters);

// router.get("/fetch-printers", fetchPrintersFromJson);





export default router;
