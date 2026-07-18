import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/API';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  CheckCircle, 
  Mail, 
  Video, 
  History, 
  User as UserIcon,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import dayjs from 'dayjs';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                setLoading(true);
                const res = await api.get("/meeting/student-meetings");
                setMeetings(res.data.meetings || []);
            } catch (error) {
                console.error("Failed to fetch meetings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMeetings();
    }, []);

    // Calculate stats
    const today = dayjs().startOf('day');
    
    const upcomingMeetingsCount = meetings.filter(m => m.status === 'Scheduled' && (dayjs(m.date).isAfter(today, 'day') || dayjs(m.date).isSame(today, 'day'))).length;
    const completedMeetingsCount = meetings.filter(m => m.status === 'Completed').length;
    const pendingInvitations = 0; // Static 0 for now as per schema logic

    const stats = [
        { label: "Upcoming Meetings", value: upcomingMeetingsCount, icon: Calendar },
        { label: "Completed Meetings", value: completedMeetingsCount, icon: CheckCircle },
        { label: "Pending Invitations", value: pendingInvitations, icon: Mail },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Scheduled': return 'bg-white text-zinc-900 border-zinc-300';
            case 'Completed': return 'bg-zinc-900 text-white border-zinc-900';
            case 'Cancelled': return 'bg-zinc-100 text-zinc-500 border-zinc-200 line-through';
            default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
        }
    };

    const nextMeeting = meetings.find(m => m.status === 'Scheduled' && (dayjs(m.date).isAfter(today, 'day') || dayjs(m.date).isSame(today, 'day')));

    const handleJoinMeeting = async (e, meeting) => {
        e.preventDefault();
        if (!meeting || !meeting.meetLink) return;

        try {
            await api.post(`/attendance/join/${meeting._id}`);
            toast.success("Attendance marked as Present!");
            window.open(meeting.meetLink, "_blank");
        } catch (error) {
            console.error("Attendance Error:", error);
            const msg = error.response?.data?.message || "Failed to mark attendance";
            toast.error(msg);
            
            // If you want to strictly prevent joining if attendance fails, keep it this way.
            // If it's a "Already joined" error, the API currently doesn't throw, it returns success.
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-6 lg:p-8 font-sans selection:bg-zinc-200">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Student Dashboard</h1>
                        <p className="text-zinc-500 mt-1">Welcome back. Here is your learning schedule.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:border-zinc-300 transition-colors group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-zinc-500 mb-1">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-zinc-900">{stat.value}</h3>
                                </div>
                                <div className="p-3 rounded-xl bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
                                    <stat.icon className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 lg:col-span-1 h-fit">
                        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <a 
                                href={nextMeeting?.meetLink || '#'} 
                                onClick={(e) => {
                                    if (nextMeeting) {
                                        handleJoinMeeting(e, nextMeeting);
                                    } else {
                                        e.preventDefault();
                                    }
                                }}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all group ${nextMeeting ? 'bg-zinc-50 hover:bg-zinc-100 border-transparent hover:border-zinc-300 cursor-pointer' : 'bg-zinc-50 border-zinc-200 opacity-60 cursor-not-allowed'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-colors">
                                        <Video className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="font-medium text-zinc-700 group-hover:text-zinc-900">Join Meeting</span>
                                        <span className="text-xs text-zinc-500">{nextMeeting ? 'Join your next scheduled meeting' : 'No upcoming meetings'}</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                            </a>

                            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-transparent hover:border-zinc-300 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-colors">
                                        <History className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-zinc-700 group-hover:text-zinc-900">Meeting History</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-transparent hover:border-zinc-300 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-colors">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-zinc-700 group-hover:text-zinc-900">Profile</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Upcoming Meetings List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden lg:col-span-2">
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-zinc-900">Upcoming Meetings</h3>
                            <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">View All</button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50 border-b border-zinc-200">
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Mentor</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">Loading meetings...</td>
                                        </tr>
                                    ) : meetings.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">No upcoming meetings found.</td>
                                        </tr>
                                    ) : (
                                        meetings.filter(m => m.status === 'Scheduled').slice(0, 5).map((meeting) => (
                                            <tr key={meeting._id} className="hover:bg-zinc-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
                                                            <GraduationCap className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-medium text-zinc-900">{meeting.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-xs font-bold text-zinc-700" title={meeting.mentor?.username}>
                                                            {meeting.mentor?.username ? meeting.mentor.username.charAt(0).toUpperCase() : '?'}
                                                        </div>
                                                        <span className="text-sm font-medium text-zinc-700">{meeting.mentor?.username || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-zinc-900">{dayjs(meeting.date).format('MMM D, YYYY')}</span>
                                                        <span className="text-xs text-zinc-500">{dayjs(meeting.startTime).format('h:mm A')} - {dayjs(meeting.endTime).format('h:mm A')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(meeting.status)}`}>
                                                        {meeting.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {meeting.meetLink ? (
                                                        <a 
                                                            href={meeting.meetLink} 
                                                            onClick={(e) => handleJoinMeeting(e, meeting)}
                                                            className="text-sm font-medium text-zinc-900 underline decoration-zinc-300 hover:decoration-zinc-900 transition-colors"
                                                        >
                                                            Join
                                                        </a>
                                                    ) : (
                                                        <span className="text-sm text-zinc-400">No link</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
