import React, { useMemo } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Video, Calendar as CalendarIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const localizer = dayjsLocalizer(dayjs);

const MeetingCalendar = ({ meetings, handleJoin }) => {
    const events = useMemo(() => {
        if (!meetings || !Array.isArray(meetings)) return [];
        return meetings.map(m => {
            const dateStr = dayjs(m.date).format('YYYY-MM-DD');
            const start = new Date(m.startTime);
            const end = new Date(m.endTime);
            
            return {
                id: m._id,
                title: m.title,
                start,
                end,
                resource: m,
            };
        });
    }, [meetings]);

    const EventComponent = ({ event }) => {
        const { resource } = event;
        const isScheduled = resource.status === 'Scheduled';
        const isCompleted = resource.status === 'Completed';
        const isCancelled = resource.status === 'Cancelled';
        
        let bgColor = 'bg-zinc-800'; // default scheduled
        if (isCompleted) bgColor = 'bg-emerald-600';
        if (isCancelled) bgColor = 'bg-red-500';

        return (
            <div className={`h-full w-full px-1.5 py-1 rounded-sm ${bgColor} text-white text-xs overflow-hidden leading-tight flex flex-col justify-between group`}>
                <div className="font-semibold truncate">{event.title}</div>
                {resource.status !== 'Scheduled' && (
                    <div className="text-[9px] opacity-80 uppercase tracking-wider mt-0.5">{resource.status}</div>
                )}
            </div>
        );
    };

    const handleSelectEvent = (event) => {
        const { resource } = event;
        if (resource.status === 'Scheduled' && resource.meetLink) {
            if (handleJoin) {
                // If the parent provided a handler (e.g. for student attendance), use it
                handleJoin({ preventDefault: () => {} }, resource);
            } else {
                window.open(resource.meetLink, '_blank');
            }
        } else if (resource.status !== 'Scheduled') {
            toast(`Meeting is ${resource.status}`, { icon: 'ℹ️' });
        } else {
            toast('No meeting link available', { icon: '⚠️' });
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200" style={{ height: '700px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day']}
                defaultView="month"
                onSelectEvent={handleSelectEvent}
                components={{
                    event: EventComponent,
                }}
                className="custom-calendar"
            />
        </div>
    );
};

export default MeetingCalendar;
