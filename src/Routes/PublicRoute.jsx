import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  const { user, role } = useSelector((state) => state.auth);

  // If user is logged in, redirect to appropriate dashboard
  if (user) {
    switch (role) {
      case 'admin':
        return <Navigate to="/admin/question-setup" replace />;
      case 'teacher':
        return <Navigate to="/teacher/dashboard" replace />;
      case 'student':
        return <Navigate to="/student/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // If no user is logged in, render the public route
  return children;
};

export default PublicRoute; 