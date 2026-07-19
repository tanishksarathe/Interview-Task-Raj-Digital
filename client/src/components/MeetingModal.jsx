import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  User,
  Calendar,
  Clock,
  Video,
  FileText,
  ChevronDown,
  CheckSquare,
  Square,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import api from "../config/API";
// Mock Student Database for the search panel (simulating backend response)

const MEETING_TYPES = [
  "Interview",
  "Technical Assessment",
  "Training",
  "Classroom",
  "Mentorship",
  "Mock Interview",
  "Group Discussion",
];

const STATUS_OPTIONS = ["Scheduled", "Completed", "Cancelled"];

export default function CreateMeetingModal({ onClose }) {
  const [allStudents, setAllStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, setUser, login, setLogin } = useAuth();

  // Target schema-aligned initial single state object
  const [formData, setFormData] = useState({
    mentor: user?._id || "660a1b2c3d4e5f6a7b8c9000", // Extracted MongoDB ObjectId
    participants: [], // Array of ObjectIds as specified in Mongoose Schema
    title: "",
    description: "",
    meetingType: "Technical Assessment",
    date: "2026-07-18",
    startTime: "10:00",
    endTime: "11:00",
    googleEventId: "",
    meetLink: "",
    status: "Scheduled",
  });

  const fetchAllStudents = async () => {
    try {
      const res = await api.get("/students/list");
      console.log(res?.data?.data);

      setAllStudents(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Dedicated core handler for clean ObjectId arrays
  const handleParticipantToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.participants.includes(id);
      return {
        ...prev,
        participants: exists
          ? prev.participants.filter((item) => item !== id)
          : [...prev.participants, id],
      };
    });
  };

  // Search filtering logic
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) =>
      student.username?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, allStudents]);

  // Resolving full data arrays for rendering pills/chips
  const selectedStudentsData = useMemo(() => {
    return allStudents.filter((student) =>
      formData.participants.includes(student._id),
    );
  }, [formData.participants, allStudents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Form Data:", formData);
    try {
      const res = await api.post("/meeting/createmeeting", { ...formData, mentor: user?._id || formData.mentor });
      console.log(res?.data?.data);
      toast.success("Meeting scheduled successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    }
  };

  //   if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
      {/* 5XL Container Definition */}
      <div className="w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 max-h-[90vh]">
        {/* Header Block */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-800 bg-black">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Schedule Session Workspace
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Configure timeline details and enroll members on a centralized
              state architecture.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-900 rounded-lg transition-all"
          >
            <X size={22} />
          </button>
        </div>

        {/* 2-Column Responsive Body Split */}
        <div className="flex flex-1 overflow-hidden divide-x divide-zinc-800">
          {/* LEFT PANEL: General Details Fields (Takes 60% Width) */}
          <div className="w-full md:w-7/12 p-8 overflow-y-auto space-y-5 custom-scrollbar bg-zinc-950">
            {/* Auto-set Mentor Section */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Assigned Mentor
              </label>
              <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800/80 text-zinc-400 px-3 py-2.5 rounded-xl cursor-not-allowed select-none">
                <span className="text-sm font-medium text-zinc-300">
                  {user?.username || "Tanishk Sarathe"} (You)
                </span>
                <span className="text-[10px] tracking-mono bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded border border-zinc-700">
                  {formData.mentor}
                </span>
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Meeting Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Specify target agenda or curriculum focus..."
                required
                className="w-full bg-black border border-zinc-800 text-white placeholder-zinc-700 px-3 py-2.5 rounded-xl focus:outline-none focus:border-zinc-400 hover:border-zinc-700 transition-all text-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Outline instructions, preparation notes, or goals..."
                rows={3}
                required
                className="w-full bg-black border border-zinc-800 text-white placeholder-zinc-700 px-3 py-2.5 rounded-xl focus:outline-none focus:border-zinc-400 hover:border-zinc-700 transition-all text-sm resize-none"
              />
            </div>

            {/* Split Row for Type and Status Selector */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Meeting Type *
                </label>
                <div className="relative">
                  <select
                    name="meetingType"
                    value={formData.meetingType}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-zinc-400 hover:border-zinc-700 transition-all text-sm appearance-none cursor-pointer"
                  >
                    {MEETING_TYPES.map((type) => (
                      <option
                        key={type}
                        value={type}
                        className="bg-zinc-950 text-white"
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-zinc-400 hover:border-zinc-700 transition-all text-sm appearance-none cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option
                        key={status}
                        value={status}
                        className="bg-zinc-950 text-white"
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Scheduling Variables Layout */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-zinc-800 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-zinc-400 transition-all text-sm appearance-none"
                  />
                  <Calendar
                    size={15}
                    className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Start Time *
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-zinc-800 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-zinc-400 transition-all text-sm"
                  />
                  <Clock
                    size={15}
                    className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  End Time *
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-zinc-800 text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-zinc-400 transition-all text-sm"
                  />
                  <Clock
                    size={15}
                    className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Optional Links Block */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Meet Link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="meetLink"
                    value={formData.meetLink}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/abc-defg-hij"
                    className="w-full bg-black border border-zinc-800 text-white placeholder-zinc-700 pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-zinc-400 transition-all text-sm"
                  />
                  <Video
                    size={15}
                    className="absolute left-3 top-3.5 text-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Google Event ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="googleEventId"
                    value={formData.googleEventId}
                    onChange={handleChange}
                    placeholder="Auto-populated if integrated..."
                    className="w-full bg-black border border-zinc-800 text-white placeholder-zinc-700 pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-zinc-400 transition-all text-sm"
                  />
                  <FileText
                    size={15}
                    className="absolute left-3 top-3.5 text-zinc-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Search & Enrolment Dashboard (Takes 40% Width) */}
          <div className="w-full md:w-5/12 p-8 flex flex-col justify-between bg-black">
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  Participants Enrolment
                </label>
                <p className="text-[11px] text-zinc-500">
                  Filter through class directories to inject target ObjectIds
                  into array model.
                </p>
              </div>

              {/* Input Area */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search via username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-700 pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-zinc-400 transition-all text-sm"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-3.5 text-zinc-600"
                />
              </div>

              {/* Dynamic Chips Container */}
              {selectedStudentsData.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-zinc-400">
                      Selected List
                    </span>
                    <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md">
                      {selectedStudentsData.length} Active
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto p-2 bg-zinc-950 border border-zinc-800 rounded-xl custom-scrollbar">
                    {selectedStudentsData.map((student) => (
                      <div
                        key={student._id}
                        className="flex items-center gap-1 bg-white text-black pl-2.5 pr-1.5 py-0.5 rounded-full text-xs font-semibold transition-all hover:bg-zinc-200"
                      >
                        <span>{student.username}</span>
                        <button
                          type="button"
                          onClick={() => handleParticipantToggle(student._id)}
                          className="hover:bg-zinc-300 rounded-full p-0.5 transition-colors"
                        >
                          <X size={11} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checkbox Directory Viewport */}
              <div className="flex-1 flex flex-col min-h-0 pt-1">
                <span className="text-xs font-medium text-zinc-400 block mb-1.5">
                  Directory Matching Layout
                </span>
                <div className="flex-1 border border-zinc-800 bg-zinc-950 rounded-xl overflow-y-auto divide-y divide-zinc-900 custom-scrollbar max-h-[220px]">
                  {filteredStudents.length === 0 ? (
                    <div className="p-4 text-xs text-zinc-600 text-center">
                      No student objects fit current context
                    </div>
                  ) : (
                    filteredStudents.map((student) => {
                      const isChecked = formData.participants.includes(
                        student._id,
                      );
                      return (
                        <div
                          key={student._id}
                          onClick={() => handleParticipantToggle(student._id)}
                          className="flex items-center justify-between px-4 py-3 text-xs text-zinc-400 hover:bg-zinc-900/60 cursor-pointer select-none transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            {isChecked ? (
                              <CheckSquare size={16} className="text-white" />
                            ) : (
                              <Square
                                size={16}
                                className="text-zinc-700 group-hover:text-zinc-500 transition-colors"
                              />
                            )}
                            <span
                              className={
                                isChecked
                                  ? "text-white font-medium"
                                  : "group-hover:text-zinc-200"
                              }
                            >
                              {student.username}
                            </span>
                          </div>
                          <span className="text-[9px] tracking-mono font-mono text-zinc-600">
                            {student._id.substring(0, 8)}...
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Action Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-zinc-800 bg-black">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white bg-transparent rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2.5 text-sm font-semibold text-black bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            Create Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
