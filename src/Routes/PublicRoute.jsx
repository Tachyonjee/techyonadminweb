import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');

  // If user is logged in, redirect to their respective dashboard
  if (user && role) {
    if (role === 'admin') return (<Navigate to="/admin/dashboard" />);
    if (role === 'teacher') return <Navigate to="/teacher/dashboard" />;
    if (role === 'student') return <Navigate to="/student/dashboard" />;
  }

  // If not logged in, allow access
  return children;
};

export default PublicRoute;
