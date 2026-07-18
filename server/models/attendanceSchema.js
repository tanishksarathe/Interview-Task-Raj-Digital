import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    meeting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent",
    },
    joinTime: {
      type: Date,
      default: null,
    },
    leaveTime: {
      type: Date,
      default: null,
    },
    duration: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
