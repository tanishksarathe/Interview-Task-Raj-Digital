import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, login } = useAuth();

    // If user is not logged in, redirect to home page
    if (!login || !user) {
        return <Navigate to="/" replace />;
    }

    // If user role doesn't match the allowed role, redirect to appropriate dashboard or home
    if (user.role !== allowedRole) {
        if (user.role === 'teacher') {
            return <Navigate to="/faculty-dashboard" replace />;
        } else if (user.role === 'student') {
            return <Navigate to="/student-dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    // If everything is fine, render the protected component
    return children;
};

export default ProtectedRoute;
