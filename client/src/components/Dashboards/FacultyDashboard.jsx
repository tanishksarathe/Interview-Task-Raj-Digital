import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CreateMeetingModal from '../MeetingModal';
import api from '../../config/API';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Users, 
  Plus, 
  Settings, 
  History, 
  User as UserIcon,
  Video,
  ChevronRight,
  RefreshCw,
  FileText,
  Download
} from 'lucide-react';
import dayjs from 'dayjs';

const FacultyDashboard = () => {
    const { user } = useAuth();
    const [openForm, setOpenForm] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCalendarSynced, setIsCalendarSynced] = useState(false);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                setLoading(true);
                const res = await api.get("/meeting/mentor-meetings");
                setMeetings(res.data.meetings || []);
                setIsCalendarSynced(res.data.isCalendarSynced || false);
            } catch (error) {
                console.error("Failed to fetch meetings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMeetings();
    }, []);

    const handleGoogleCalendar = async () => {
        try {
            const res = await api.get("/google/connect");
            if (res?.data?.url) {
                window.open(res.data.url, "_blank");
            }
        } catch (error) {
            console.error("Google connect error:", error);
        }
    };

    const handleCancelMeeting = async (meetingId) => {
        if (!window.confirm("Are you sure you want to cancel this meeting? Participants will be notified via email.")) return;
        
        try {
            await api.patch(`/meeting/cancel/${meetingId}`);
            import('react-hot-toast').then(({ default: toast }) => toast.success("Meeting cancelled successfully"));
            setMeetings(prev => prev.map(m => m._id === meetingId ? { ...m, status: 'Cancelled' } : m));
        } catch (error) {
            console.error("Cancel meeting error:", error);
            const msg = error.response?.data?.message || "Failed to cancel meeting";
            import('react-hot-toast').then(({ default: toast }) => toast.error(msg));
        }
    };

    const handleDownload = async (meetingId, type) => {
        try {
            const toast = (await import('react-hot-toast')).default;
            const toastId = toast.loading(`Generating ${type.toUpperCase()}...`);
            
            const res = await api.get(`/attendance/export/${type}/${meetingId}`, {
                responseType: 'blob',
                withCredentials: true
            });
            
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance-${meetingId}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            
            // cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success(`${type.toUpperCase()} downloaded!`, { id: toastId });
        } catch (error) {
            console.error(`Error downloading ${type}:`, error);
            import('react-hot-toast').then(({ default: toast }) => toast.error(`Failed to download ${type.toUpperCase()}`));
        }
    };

    // Calculate stats
    const today = dayjs().startOf('day');
    
    const todaysMeetings = meetings.filter(m => dayjs(m.date).isSame(today, 'day')).length;
    const upcomingMeetings = meetings.filter(m => m.status === 'Scheduled' && dayjs(m.date).isAfter(today, 'day') || dayjs(m.date).isSame(today, 'day')).length;
    const completedMeetings = meetings.filter(m => m.status === 'Completed').length;
    
    // Calculate unique students
    const uniqueStudents = new Set();
    meetings.forEach(m => {
        m.participants?.forEach(p => uniqueStudents.add(p._id));
    });
    const studentsAssigned = uniqueStudents.size;

    const stats = [
        { label: "Today's Meetings", value: todaysMeetings, icon: Calendar },
        { label: "Upcoming", value: upcomingMeetings, icon: Clock },
        { label: "Completed", value: completedMeetings, icon: CheckCircle },
        { label: "Students Assigned", value: studentsAssigned, icon: Users },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Scheduled': return 'bg-white text-zinc-900 border-zinc-300';
            case 'Completed': return 'bg-zinc-900 text-white border-zinc-900';
            case 'Cancelled': return 'bg-zinc-100 text-zinc-500 border-zinc-200 line-through';
            default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-6 lg:p-8 font-sans selection:bg-zinc-200">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Faculty Dashboard</h1>
                        <p className="text-zinc-500 mt-1">Welcome back. Here is your teaching overview.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleGoogleCalendar} 
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-100 hover:text-zinc-900 transition-all text-sm font-medium shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Sync Calendar
                        </button>
                        <button 
                            onClick={() => {
                                if (!isCalendarSynced) {
                                    import('react-hot-toast').then(({ default: toast }) => toast.error("Please sync your Google Calendar first!"));
                                    return;
                                }
                                setOpenForm(true);
                            }} 
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-black hover:shadow-md transition-all text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Create Meeting
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            <button 
                                onClick={() => {
                                    if (!isCalendarSynced) {
                                        import('react-hot-toast').then(({ default: toast }) => toast.error("Please sync your Google Calendar first!"));
                                        return;
                                    }
                                    setOpenForm(true);
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-transparent hover:border-zinc-300 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-colors">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-zinc-700 group-hover:text-zinc-900">Create Meeting</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-transparent hover:border-zinc-300 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-colors">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-zinc-700 group-hover:text-zinc-900">Manage Meetings</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                            </button>

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

                    {/* Recent Meetings Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden lg:col-span-2">
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-zinc-900">Recent Meetings</h3>
                            <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">View All</button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50 border-b border-zinc-200">
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Student(s)</th>
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
                                            <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">No recent meetings found.</td>
                                        </tr>
                                    ) : (
                                        meetings.slice(0, 5).map((meeting) => (
                                            <tr key={meeting._id} className="hover:bg-zinc-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
                                                            <Video className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-medium text-zinc-900">{meeting.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {meeting.participants?.map((p, i) => (
                                                            <div key={p._id || i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-zinc-200 border border-zinc-300 flex items-center justify-center text-xs font-bold text-zinc-700" title={p.username}>
                                                                {p.username ? p.username.charAt(0).toUpperCase() : '?'}
                                                            </div>
                                                        ))}
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
                                                    <div className="flex items-center gap-3">
                                                        {meeting.meetLink ? (
                                                            <a 
                                                                href={meeting.meetLink} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-sm font-medium text-zinc-900 underline decoration-zinc-300 hover:decoration-zinc-900 transition-colors"
                                                            >
                                                                Join
                                                            </a>
                                                        ) : (
                                                            <span className="text-sm text-zinc-400">No link</span>
                                                        )}
                                                        {meeting.status === 'Scheduled' && (
                                                            <button 
                                                                onClick={() => handleCancelMeeting(meeting._id)}
                                                                className="text-sm font-medium text-red-600 underline decoration-red-200 hover:decoration-red-600 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Attendance Reports Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden mt-8">
                    <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900">Attendance Reports</h3>
                            <p className="text-sm text-zinc-500 mt-1">Download attendance records for your completed meetings.</p>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50 border-b border-zinc-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Downloads</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-zinc-500">Loading reports...</td>
                                    </tr>
                                ) : meetings.filter(m => m.status === 'Completed').length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-zinc-500">No completed meetings available for reports.</td>
                                    </tr>
                                ) : (
                                    meetings.filter(m => m.status === 'Completed').map((meeting) => (
                                        <tr key={meeting._id} className="hover:bg-zinc-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-medium text-zinc-900">{meeting.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-zinc-900">{dayjs(meeting.date).format('MMM D, YYYY')}</span>
                                                    <span className="text-xs text-zinc-500">{dayjs(meeting.startTime).format('h:mm A')} - {dayjs(meeting.endTime).format('h:mm A')}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => handleDownload(meeting._id, 'excel')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors text-xs font-semibold"
                                                    >
                                                        <FileText className="w-3.5 h-3.5" />
                                                        Excel
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDownload(meeting._id, 'pdf')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors text-xs font-semibold"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        PDF
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {openForm && <CreateMeetingModal onClose={() => setOpenForm(false)} />}
        </div>
    );
};

export default FacultyDashboard;
