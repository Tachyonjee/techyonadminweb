import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // If user not logged in, redirect to sign in
  if (!user) return <Navigate to="/signin" />;

  // Else allow access
  return children;
};

export default ProtectedRoute;
