import Meeting from "../models/meetingModel.js";
import User from "../models/userModel.js";
import { createCalendarEvent } from "../util/googleCalendar.js";

const buildMeetingDateTime = (date, time) => {
  return new Date(`${date}T${time}:00`).toISOString();
};

export const addingNewMeeting = async (req, res, next) => {
  try {
    const {
      mentor,
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

    console.log("Request Body:", req.body);

    const mento = await User.findById(mentor);

    if(!mento) {
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


    console.log("Calendar Event Created:", calendarEvent.data);

  } catch (error) {
    console.error("Error in addingNewMeeting:", error);
    next(error);
  }
};
