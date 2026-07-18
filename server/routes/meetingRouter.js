import express from 'express';
import { addingNewMeeting, getMentorMeetings, getStudentMeetings, cancelMeeting } from '../controller/meetingController.js';
import { protect } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post("/createmeeting", addingNewMeeting);
router.get("/mentor-meetings", protect, getMentorMeetings);
router.get("/student-meetings", protect, getStudentMeetings);
router.patch("/cancel/:meetingId", protect, cancelMeeting);

export default router;