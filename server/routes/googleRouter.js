import express from "express";
import { connectGoogleCalendar } from "../controller/googleController.js";

const router = express.Router();

router.get("/connect", connectGoogleCalendar);

export default router;