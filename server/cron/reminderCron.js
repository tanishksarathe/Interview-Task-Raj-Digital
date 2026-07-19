import cron from 'node-cron';
import emailjs from '@emailjs/nodejs';
import Meeting from '../models/meetingModel.js';

const sendReminder = async (meeting, windowLabel) => {
  try {
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PUBLIC_KEY) {
      const participantEmails = meeting.participants.map(p => p.email).join(',');

      if (!participantEmails) {
        console.log(`[Cron] No participants for meeting: ${meeting._id}`);
        return true; // Return true so it marks as sent
      }

      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        {
          to_emails: participantEmails,
          meeting_title: `[REMINDER: ${windowLabel}] ${meeting.title}`,
          meeting_date: new Date(meeting.date).toLocaleDateString(),
          meeting_time: `${new Date(meeting.startTime).toLocaleTimeString()} to ${new Date(meeting.endTime).toLocaleTimeString()}`,
          meet_link: meeting.meetLink || "No link generated",
          mentor_name: meeting.mentor?.username || "Your Mentor",
          description: `This is an automated reminder that your meeting is starting in ${windowLabel}. \n\nOriginal Description: ${meeting.description}`
        },
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY,
          privateKey: process.env.EMAILJS_PRIVATE_KEY,
        }
      );
      console.log(`[Cron] Reminder (${windowLabel}) sent for meeting: ${meeting._id} to ${participantEmails}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`[Cron] Error sending ${windowLabel} reminder for meeting ${meeting._id}:`, error);
    return false;
  }
};

export const startReminderCron = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('[Cron] Running meeting reminder check...');
    try {
      const now = new Date();

      // Calculate target time windows
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const in1h = new Date(now.getTime() + 60 * 60 * 1000);
      const in15m = new Date(now.getTime() + 15 * 60 * 1000);

      // 1. Check for 24 Hour Reminders
      // Find meetings that start within 24 hours, but haven't been sent a 24h reminder
      const meetings24h = await Meeting.find({
        status: "Scheduled",
        reminded24h: false,
        startTime: { $gt: now, $lte: in24h }
      }).populate('participants mentor');

      for (const meeting of meetings24h) {
        const success = await sendReminder(meeting, "24 Hours");
        if (success) {
          meeting.reminded24h = true;
          await meeting.save();
        }
      }

      // 2. Check for 1 Hour Reminders
      const meetings1h = await Meeting.find({
        status: "Scheduled",
        reminded1h: false,
        startTime: { $gt: now, $lte: in1h }
      }).populate('participants mentor');

      for (const meeting of meetings1h) {
        const success = await sendReminder(meeting, "1 Hour");
        if (success) {
          meeting.reminded1h = true;
          await meeting.save();
        }
      }

      // 3. Check for 15 Minute Reminders
      const meetings15m = await Meeting.find({
        status: "Scheduled",
        reminded15m: false,
        startTime: { $gt: now, $lte: in15m }
      }).populate('participants mentor');

      for (const meeting of meetings15m) {
        const success = await sendReminder(meeting, "15 Minutes");
        if (success) {
          meeting.reminded15m = true;
          await meeting.save();
        }
      }

    } catch (error) {
      console.error('[Cron] Error during meeting reminder check:', error);
    }
  });
  console.log('[Cron] Meeting reminder cron job initialized (runs every 5 minutes).');
};
