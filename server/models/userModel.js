import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleId: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["teacher", "student", ""],
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    google: {
      accessToken: String,

      refreshToken: String,

      expiryDate: Number,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
