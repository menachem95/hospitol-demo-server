import { Router } from "express";
import { getPrinterLogs } from "../controlers/logControler.js";

const router = Router();

router.get("/logs/onePrinter/:printer/:start/:end", getPrinterLogs);



// router.get("/fetch-printers", fetchPrintersFromJson);





export default router;
