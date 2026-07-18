import express from "express";
import { connectGoogleCalendar } from "../controller/googleController.js";
import { protect } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/connect", protect,connectGoogleCalendar);

export default router;