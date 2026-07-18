import { google } from "googleapis";

export const createCalendarEvent = async ({
  refreshToken,
  summary,
  description,
  startDateTime,
  endDateTime,
  attendees = [],
  timeZone,
  calendarId = "primary",
}) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    process.env.GOOGLE_CALENDAR_REDIRECT_URI
  );

  // Use the mentor's refresh token
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  const response = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    sendUpdates: "all",

    requestBody: {
      summary,
      description,

      start: {
        dateTime: startDateTime,
        timeZone,
      },

      end: {
        dateTime: endDateTime,
        timeZone,
      },

      attendees,

      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  return response.data;
};