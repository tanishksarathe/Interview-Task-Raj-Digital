import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    meetingType: {
      type: String,
      enum: [
        "Interview",
        "Technical Assessment",
        "Training",
        "Classroom",
        "Mentorship",
        "Mock Interview",
        "Group Discussion",
      ],
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    googleEventId: {
      type: String,
      default: "",
    },
    meetLink: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  },
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
    