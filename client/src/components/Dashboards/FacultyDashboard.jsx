import React from 'react'
import { useAuth } from '../../context/AuthContext'
import CreateMeetingModal from '../MeetingModal';
import { useState } from 'react';

const FacultyDashboard = () => {
    const {user, setUser, login, isLogin} = useAuth();

    const [openForm, setOpenForm] = useState(false);

  return (
    <>
    <div>
      Faculty Dashboard
      <button onClick={()=> setOpenForm(true)} className='border px-3 py-2'>Create Meeting</button>
    </div>
    {
        openForm && <CreateMeetingModal onClose={()=> setOpenForm(false)}/>
    }
    </>
  )
}

export default FacultyDashboard
