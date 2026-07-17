import User from "../models/userModel.js";
import { genToken } from "../util/authToken.js";
import verifyGoogleLogin from "../util/OAuthVerify.js";

export const registerController = async (req, res, next) => {};

export const loginController = async (req, res, next) => {
  const { idToken } = req.body;

  const payload = await verifyGoogleLogin(idToken);

  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    await genToken(existingUser, res);
    return res.status(200).json({
      message: "Login Successful",
      user: existingUser,
    });
  }

  const newUser = await User.create({
    username: payload.name,
    email: payload.email,
    googleId: payload.sub,
    photo: payload.picture,
    role:""
  });

  await genToken(newUser, res);

  return res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
};

export const logoutController = (req, res, next) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    next(error);
  }
};


export const updateRoleController = async (req, res, next) => {
  try {
    const { role } = req.body;

    req.user.role = role;
    await req.user.save();

    return res.status(200).json({
      message: "Profile completed successfully",
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};