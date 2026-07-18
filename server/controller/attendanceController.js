import Attendance from "../models/attendanceSchema.js";
import Meeting from "../models/meetingModel.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

// Utility to calculate duration between two dates in "HH:MM:SS" format
const calculateDuration = (joinTime, leaveTime) => {
  const diffInMs = Math.abs(leaveTime - joinTime);
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const getMeetingAttendance = async (req, res, next) => {
  try {
    const { meetingId } = req.params;

    const attendanceRecords = await Attendance.find({ meeting: meetingId })
      .populate("participant", "username email photo")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: attendanceRecords,
    });
  } catch (error) {
    console.error("Error in getMeetingAttendance:", error);
    next(error);
  }
};

export const markJoin = async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user._id;

    // Verify Meeting exists
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ success: false, message: "Meeting not found" });
    }

    if (meeting.status !== "Scheduled") {
      return res.status(400).json({ success: false, message: `Meeting is currently ${meeting.status}. Cannot join.` });
    }

    // Check time constraints (allow joining up to 15 mins early and until the meeting ends)
    const now = new Date();
    const meetingStart = new Date(meeting.startTime);
    const meetingEnd = new Date(meeting.endTime);
    const fifteenMinsBefore = new Date(meetingStart.getTime() - 15 * 60000);

    if (now < fifteenMinsBefore) {
      return res.status(403).json({ success: false, message: "Too early to join. You can join 15 minutes before start time." });
    }

    if (now > meetingEnd) {
      return res.status(403).json({ success: false, message: "Meeting has already ended." });
    }

    // Update or Create Attendance Record
    let attendance = await Attendance.findOne({ meeting: meetingId, participant: userId });

    if (!attendance) {
      // Fallback if record wasn't created during meeting creation
      attendance = new Attendance({
        meeting: meetingId,
        participant: userId,
      });
    }

    // Only update join time if it's their first time joining
    if (!attendance.joinTime) {
      attendance.joinTime = now;
      attendance.status = "Present";
      await attendance.save();
    }

    res.status(200).json({
      success: true,
      message: "Attendance marked as Present",
      data: attendance,
    });
  } catch (error) {
    console.error("Error in markJoin:", error);
    next(error);
  }
};

export const markLeave = async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user._id;

    const attendance = await Attendance.findOne({ meeting: meetingId, participant: userId });

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    if (!attendance.joinTime) {
      return res.status(400).json({ success: false, message: "Cannot mark leave before joining" });
    }

    const now = new Date();
    attendance.leaveTime = now;
    attendance.duration = calculateDuration(new Date(attendance.joinTime), now);
    
    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Leave time recorded",
      data: attendance,
    });
  } catch (error) {
    console.error("Error in markLeave:", error);
    next(error);
  }
};

export const exportAttendanceExcel = async (req, res, next) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findOne({ _id: meetingId, mentor: req.user._id });
    if (!meeting) {
      return res.status(404).json({ success: false, message: "Meeting not found or unauthorized" });
    }

    const attendanceRecords = await Attendance.find({ meeting: meetingId })
      .populate("participant", "username email");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance Report");

    worksheet.columns = [
      { header: "Student Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Status", key: "status", width: 15 },
      { header: "Join Time", key: "joinTime", width: 25 },
      { header: "Leave Time", key: "leaveTime", width: 25 },
      { header: "Duration", key: "duration", width: 15 },
    ];

    attendanceRecords.forEach(record => {
      worksheet.addRow({
        name: record.participant?.username || "Unknown",
        email: record.participant?.email || "N/A",
        status: record.status,
        joinTime: record.joinTime ? new Date(record.joinTime).toLocaleString() : "-",
        leaveTime: record.leaveTime ? new Date(record.leaveTime).toLocaleString() : "-",
        duration: record.duration || "-",
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=attendance-${meetingId}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting Excel:", error);
    next(error);
  }
};

export const exportAttendancePdf = async (req, res, next) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findOne({ _id: meetingId, mentor: req.user._id });
    if (!meeting) {
      return res.status(404).json({ success: false, message: "Meeting not found or unauthorized" });
    }

    const attendanceRecords = await Attendance.find({ meeting: meetingId })
      .populate("participant", "username email");

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=attendance-${meetingId}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).text("Attendance Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Meeting: ${meeting.title}`);
    doc.fontSize(12).text(`Date: ${new Date(meeting.date).toLocaleDateString()} | Time: ${meeting.startTime} - ${meeting.endTime}`);
    doc.moveDown();

    // Table Header
    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("Student Name", 50, doc.y, { continued: true, width: 150 });
    doc.text("Status", 200, doc.y, { continued: true, width: 100 });
    doc.text("Duration", 300, doc.y);
    doc.moveDown(0.5);

    // Separator line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Table Rows
    doc.font("Helvetica");
    attendanceRecords.forEach(record => {
      doc.text(record.participant?.username || "Unknown", 50, doc.y, { continued: true, width: 150 });
      doc.text(record.status, 200, doc.y, { continued: true, width: 100 });
      doc.text(record.duration || "-", 300, doc.y);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error("Error exporting PDF:", error);
    next(error);
  }
};
