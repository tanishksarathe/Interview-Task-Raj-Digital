import oauth2Client from "../config/google.js";
import User from "../models/userModel.js";

export const connectGoogleCalendar = (req, res) => {

  console.log("Connect ke andar aa gye");

  console.log(req.user);

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",

    prompt: "consent",

    scope: ["https://www.googleapis.com/auth/calendar"],

    state: req.user._id.toString(),
  });

  console.log("Generated Google Calendar authorization URL:", url);

  res.json({
    url,
  });
};

export const googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    console.log("Code:", code);
    console.log("State:", state);

    const { tokens } = await oauth2Client.getToken(code);

    console.log(tokens);

    const user = await User.findById(state);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.google = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    };

    await user.save();

    return res.redirect("http://localhost:5173/faculty-dashboard");
  } catch (err) {
    console.error(err.response?.data || err);
    return res.status(500).json(err.response?.data || err.message);
  }
};