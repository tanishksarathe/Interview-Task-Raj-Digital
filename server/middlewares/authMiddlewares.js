import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const gotCookie = req?.cookies?.jwt;

    const decrypted = await jwt.verify(gotCookie, process.env.JWT_SECRET_KEY);

    // console.log(decrypted);

    if (!decrypted) {
      const error = new Error("Unauthorized User");
      error.statusCode = 401;
      return next(error);
    }

    const verifyUser = await User.findById(decrypted.id);

    if (!verifyUser) {
      const error = new Error("Unauthorized User");
      error.statusCode = 401;
      return next(error);
    }

    req.user = verifyUser;

    next();
  } catch (error) {
    next(error);
  }
};