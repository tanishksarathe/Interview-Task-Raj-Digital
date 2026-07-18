import React from 'react';
import { X } from 'lucide-react';
import dayjs from 'dayjs';

export default function MeetingHistoryModal({ meetings, onClose, isFaculty, onViewAttendance }) {
  const pastMeetings = meetings.filter(m => m.status !== 'Scheduled');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col shadow-2xl overflow-hidden max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-800 bg-black">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Meeting History</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Archive of completed and cancelled sessions.</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-900 rounded-lg transition-all">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-zinc-950 flex-1">
          {pastMeetings.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">No past meetings found.</div>
          ) : (
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-black">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 border-b border-zinc-800">
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {pastMeetings.map((meeting) => (
                    <tr key={meeting._id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-200">{meeting.title}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{meeting.meetingType}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-300">{dayjs(meeting.date).format('MMM D, YYYY')}</span>
                          <span className="text-xs text-zinc-500">{dayjs(meeting.startTime).format('h:mm A')} - {dayjs(meeting.endTime).format('h:mm A')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          meeting.status === 'Completed' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}>
                          {meeting.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {meeting.status === 'Completed' && (
                          <button 
                            onClick={() => onViewAttendance(meeting._id)}
                            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors underline decoration-indigo-800 hover:decoration-indigo-400"
                          >
                            {isFaculty ? "View Attendance" : "My Attendance"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-8 py-5 border-t border-zinc-800 bg-black">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white bg-transparent rounded-xl transition-all border border-zinc-800 hover:bg-zinc-900">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
