//import express from " ./../package/express/index.js";
import express from "../package/express/index.js";
import { fetchPrinters, fetchPrintersFromJson } from "../controlers/fetch.js";

const router = express.Router();

router.get("/fetch-printers", fetchPrinters);

// router.get("/fetch-printers", fetchPrintersFromJson);





export default router;
