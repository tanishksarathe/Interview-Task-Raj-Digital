import oauth2Client from "../config/google.js";

export const connectGoogleCalendar = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",

    prompt: "consent",

    scope: ["https://www.googleapis.com/auth/calendar"],
  });

  console.log("Generated Google Calendar authorization URL:", url);

  res.json({
    url,
  });
};

export const googleCallback = async (req, res) => {
  console.log(req.query);

  const { code } = req.query;

  const currUser = req.user;

  
  const { tokens } = await oauth2Client.getToken(code);
  
  currUser.accessToken = tokens.access_token;
  currUser.refreshToken = tokens.refresh_token;
  currUser.expiryDate = tokens.expiry_date;

  await currUser.save();

  console.log("Received tokens from Google:", tokens);

  res.send("Callback Received");
};
