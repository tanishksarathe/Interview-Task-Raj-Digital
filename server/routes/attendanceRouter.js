import express from "express";
import { getMeetingAttendance, markJoin, markLeave, exportAttendanceExcel, exportAttendancePdf } from "../controller/attendanceController.js";
import { protect } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/meeting/:meetingId", protect, getMeetingAttendance);
router.post("/join/:meetingId", protect, markJoin);
router.post("/leave/:meetingId", protect, markLeave);
router.get("/export/excel/:meetingId", protect, exportAttendanceExcel);
router.get("/export/pdf/:meetingId", protect, exportAttendancePdf);

export default router;
