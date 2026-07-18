import React from 'react'
import { useAuth } from '../../context/AuthContext'
import CreateMeetingModal from '../MeetingModal';
import { useState } from 'react';
import api from '../../config/API';

const FacultyDashboard = () => {
    const {user, setUser, login, isLogin} = useAuth();

    const [openForm, setOpenForm] = useState(false);

    const handleGoogleCalendar = async ()=>{
      try{
        const res = await api.get("/google/connect");
        console.log(res?.data?.url);
        window.open(res?.data?.url, "_blank");
      }catch(error){
        console.log(error);
      }
    }

  return (
    <>
    <div>
      Faculty Dashboard
      <button onClick={()=> setOpenForm(true)} className='border px-3 py-2'>Create Meeting</button>
    </div>
    {
        openForm && <CreateMeetingModal onClose={()=> setOpenForm(false)}/>
    }

    <button onClick={handleGoogleCalendar} className='border px-3 py-2'>Connect Google Calendar</button>
    </>
  )
}

export default FacultyDashboard
