import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../../config/API';
import dayjs from 'dayjs';

export default function AttendanceModal({ meetingId, onClose, studentId }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/attendance/meeting/${meetingId}`);
        let records = res.data.data || [];
        if (studentId) {
            records = records.filter(r => r.participant?._id === studentId);
        }
        setAttendanceRecords(records);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      } finally {
        setLoading(false);
      }
    };
    if (meetingId) fetchAttendance();
  }, [meetingId]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col shadow-2xl overflow-hidden max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-800 bg-black">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">{studentId ? 'My Attendance' : 'Attendance Details'}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{studentId ? 'Your personal attendance metrics for this session.' : 'Live attendance metrics and participation records.'}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-900 rounded-lg transition-all">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-zinc-950 flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">No attendance records found for this meeting.</div>
          ) : (
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-black">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 border-b border-zinc-800">
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Join Time</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Leave Time</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {attendanceRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-200">{record.participant?.username || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {record.participant?.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          record.status === 'Present' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' : 'bg-rose-900/30 text-rose-400 border border-rose-800/50'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {record.joinTime ? dayjs(record.joinTime).format('hh:mm:ss A') : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {record.leaveTime ? dayjs(record.leaveTime).format('hh:mm:ss A') : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400 font-mono">
                        {record.duration || '-'}
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
