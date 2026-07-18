import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();
import AuthRouter from "./routes/authRouter.js";
import StudentRouter from "./routes/studentRouter.js"
import MeetingRouter from "./routes/meetingRouter.js";
import googleRouter from "./routes/googleRouter.js";
import attendanceRouter from "./routes/attendanceRouter.js";
import { startReminderCron } from "./cron/reminderCron.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(cookieParser());

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}));

app.use(express.json());

//Routers
app.use("/auth", AuthRouter);
app.use("/meeting", MeetingRouter);
// app.use("/teacher", TeacherRouter);
app.use("/students", StudentRouter);
app.use("/google", googleRouter);
app.use("/attendance", attendanceRouter);



const PORT = process.env.PORT || 3000;



app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.use((err, req, res, next) => {
  const errorMessage = err.message || "Internal Server Error";
  const stausCode = err.statusCode || 500;

  res.status(stausCode).json({ message: errorMessage });
});


app.listen(process.env.PORT, () => {
  connectDB();
  startReminderCron();
  console.log(`Server running on port ${process.env.PORT}`);
});