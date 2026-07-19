import Meeting from "../models/meetingModel.js";
import User from "../models/userModel.js";
import Attendance from "../models/attendanceSchema.js";
import { createCalendarEvent } from "../util/googleCalendar.js";
import emailjs from "@emailjs/nodejs";

const buildMeetingDateTime = (date, time) => {
  return new Date(`${date}T${time}:00`).toISOString();
};

export const addingNewMeeting = async (req, res, next) => {
  try {
    const {
      participants = [],
      title,
      description,
      meetingType,
      date,
      startTime,
      endTime,
      status = "Scheduled",
      meetLink = "",
      googleEventId = "",
    } = req.body;

    const mentor = req.user._id;

    console.log("Request Body:", req.body);

    const mento = await User.findById(mentor);

    console.log("Mentor : ", mento);

    if (!mento) {
      const error = new Error("Mentor not found");
      error.statusCode = 404;
      return next(error);
    }

    if (!mento?.google?.refreshToken) {
      const error = new Error("Token not found");
      error.statusCode = 404;
      return next(error);
    }

    // oauth2Client.setCredentials({
    //   refresh_token: mento.refreshToken,
    // });

    // console.log("Google credentials configured successfully.");

    // const calendar = google.calendar({
    //   version: "v3",
    //   auth: oauth2Client,
    // });

    const participantUsers = await User.find(
      {
        _id: { $in: participants },
      },
      {
        email: 1,
      },
    );

    const attendees = participantUsers.map((user) => ({
      email: user.email,
    }));

    const meetingStart = buildMeetingDateTime(date, startTime);

    const meetingEnd = buildMeetingDateTime(date, endTime);

    console.log("Meeting Start Time:", meetingStart);
    console.log("Meeting End Time:", meetingEnd);

    const calendarEvent = await createCalendarEvent({
      refreshToken: mento.google.refreshToken,
      summary: title,
      description,
      startDateTime: meetingStart,
      endDateTime: meetingEnd,
      attendees,
      timeZone: "Asia/Kolkata",
    });

    const newMeeting = await Meeting.create({
      mentor,
      participants,
      title,
      description,
      meetingType,
      date,
      startTime: meetingStart,
      endTime: meetingEnd,
      status,
      googleEventId: calendarEvent.id,
      meetLink: calendarEvent.hangoutLink || "",
    });

    // Initialize Attendance records for all participants as "Absent"
    try {
      if (participants && participants.length > 0) {
        const attendanceDocs = participants.map((participantId) => ({
          meeting: newMeeting._id,
          participant: participantId,
          status: "Absent",
        }));
        await Attendance.insertMany(attendanceDocs);
        console.log("Initialized attendance records for participants.");
      }
    } catch (attendanceError) {
      console.error("Failed to initialize attendance records:", attendanceError);
    }

    try {
      if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PUBLIC_KEY) {
        // Collect all comma-separated emails
        const participantEmails = attendees.map(a => a.email).join(',');

        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID,
          process.env.EMAILJS_TEMPLATE_ID,
          {
            to_emails: participantEmails, // In your EmailJS template, use {{to_emails}} in the "To" field
            meeting_title: title,
            meeting_date: date,
            meeting_time: `${startTime} to ${endTime}`,
            meet_link: calendarEvent.hangoutLink || "No link generated",
            mentor_name: mento.username,
            description: description
          },
          {
            publicKey: process.env.EMAILJS_PUBLIC_KEY,
            privateKey: process.env.EMAILJS_PRIVATE_KEY,
          }
        );
        console.log("EmailJS notifications sent successfully to:", participantEmails);
      } else {
        console.log("EmailJS credentials missing in .env. Skipping email sending.");
      }
    } catch (emailError) {
      console.error("Failed to send EmailJS notification:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",
      meeting: newMeeting,
    });

  } catch (error) {
    console.error("Error in addingNewMeeting:", error);
    next(error);
  }
};

export const getMentorMeetings = async (req, res, next) => {
  try {
    const now = new Date();

    // Auto-complete logic
    await Meeting.updateMany(
      { mentor: req.user._id, status: "Scheduled", endTime: { $lt: now } },
      { $set: { status: "Completed" } }
    );

    const meetings = await Meeting.find({ mentor: req.user._id })
      .populate("participants", "username email photo")
      .sort({ date: -1, startTime: -1 });


      console.log("Meetings : ", meetings);

    res.status(200).json({
      success: true,
      meetings,
      isCalendarSynced: !!req.user.google?.refreshToken
    });
  } catch (error) {
    console.error("Error in getMentorMeetings:", error);
    next(error);
  }
};

export const getStudentMeetings = async (req, res, next) => {
  try {
    const now = new Date();

    // Auto-complete logic
    await Meeting.updateMany(
      { participants: req.user._id, status: "Scheduled", endTime: { $lt: now } },
      { $set: { status: "Completed" } }
    );

    const meetings = await Meeting.find({ participants: req.user._id })
      .populate("mentor", "username email photo")
      .sort({ date: -1, startTime: -1 });

    res.status(200).json({
      success: true,
      meetings,
    });
  } catch (error) {
    console.error("Error in getStudentMeetings:", error);
    next(error);
  }
};

export const cancelMeeting = async (req, res, next) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findOne({ _id: meetingId, mentor: req.user._id })
      .populate("participants", "email");

    if (!meeting) {
      return res.status(404).json({ success: false, message: "Meeting not found or you are unauthorized" });
    }

    if (meeting.status !== "Scheduled") {
      return res.status(400).json({ success: false, message: "Only scheduled meetings can be cancelled" });
    }

    meeting.status = "Cancelled";
    await meeting.save();

    // Send Cancellation Email
    try {
      if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PUBLIC_KEY) {
        const participantEmails = meeting.participants.map(a => a.email).join(',');

        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID,
          process.env.EMAILJS_TEMPLATE_ID,
          {
            to_emails: participantEmails,
            meeting_title: `[CANCELLED] ${meeting.title}`,
            meeting_date: meeting.date,
            meeting_time: "N/A",
            meet_link: "N/A",
            mentor_name: req.user.username,
            description: "Please note that this meeting has been cancelled by the mentor."
          },
          {
            publicKey: process.env.EMAILJS_PUBLIC_KEY,
            privateKey: process.env.EMAILJS_PRIVATE_KEY,
          }
        );
        console.log("Cancellation EmailJS notifications sent.");
      }
    } catch (emailError) {
      console.error("Failed to send cancellation EmailJS notification:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Meeting cancelled successfully",
      meeting,
    });
  } catch (error) {
    console.error("Error in cancelMeeting:", error);
    next(error);
  }
};
