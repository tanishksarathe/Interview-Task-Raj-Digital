import React from 'react';
import GoogleLogin from './GoogleLogin';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../config/API';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, setUser, login, setLogin } = useAuth();

    const handleLogout = async () => {
        try {
            const res = await api.get("/auth/logout");
            setUser("");
            setLogin(false);
            sessionStorage.removeItem("EduUser");
            toast.success("Logout Successful");
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Unknown Error");
        }
    };

    return (
        <nav className="border-b border-zinc-800">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                <Link to="/" className="text-2xl font-bold tracking-wide cursor-pointer">
                    Meet<span className="text-zinc-400">Sync</span>
                </Link>

                <div className="hidden gap-8 text-sm text-zinc-300 md:flex">
                    <a href="#" className="hover:text-white transition">Features</a>
                    
                    <a href="#" className="hover:text-white transition">Contact</a>
                </div>

                <div className="flex items-center gap-4">
                    {user && <div className="font-bold text-sm hidden md:block">Welcome {user.username}</div>}
                    
                    {user && user.role && (
                        <Link 
                            to={user.role === 'teacher' ? '/faculty-dashboard' : '/student-dashboard'}
                            className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                        >
                            Dashboard
                        </Link>
                    )}

                    {!user || (!user?.role || user?.role === "") ? (
                        <GoogleLogin />
                    ) : (
                        <button onClick={handleLogout} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
