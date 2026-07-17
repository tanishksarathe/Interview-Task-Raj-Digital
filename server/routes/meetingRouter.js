import express from 'express';

const router = express.Router();

router.post("/new-meet", addingNewMeeting);

export default router;