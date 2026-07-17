import React from 'react'
import GoogleLogin from './GoogleLogin'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast';
import api from '../config/API';
const Navbar = () => {

    const {user, setUser, login, setLogin} = useAuth();

    const handleLogout = async() =>{
         try {
      const res = await api.get("/auth/logout");
      setUser("");
      setLogin(false);
      sessionStorage.removeItem("EduUser");
      toast.success("Logout Successful");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Unknown Error");
    }
    }

  return (
    <>
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold tracking-wide">
            Meet<span className="text-zinc-400">Sync</span>
          </h1>

          <div className="hidden gap-8 text-sm text-zinc-300 md:flex">
            <a href="#" className="hover:text-white transition">
              Features
            </a>
            <a href="#" className="hover:text-white transition">
              How it Works
            </a>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
          </div>

        {user && <div className="font-bold">Welcome {user.username}</div>
}
        {!user ? <GoogleLogin/> : <button onClick={handleLogout}>Logout</button>}

        </div>
      </nav>
    </>
  )
}

export default Navbar
