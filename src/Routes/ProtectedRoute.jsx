import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { user, role, token } = useSelector((state) => state.auth);
  
  console.log('ProtectedRoute - Auth State:', { user, role, token });

  // If user not logged in or no token, redirect to login
  if (!user || !token) {
    console.log('ProtectedRoute: No user or token, redirecting to login');
    return <Navigate to="/signin" />;
  }

  // Else allow access
  return children;
};

export default ProtectedRoute; 