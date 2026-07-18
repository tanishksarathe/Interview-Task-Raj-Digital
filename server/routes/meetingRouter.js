import express from 'express';
import { addingNewMeeting } from '../controller/meetingController.js';
import { protect } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post("/new-meet", addingNewMeeting);

export default router;