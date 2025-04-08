import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { user, role } = useSelector((state) => state.auth);

  // If user not logged in, redirect to login
  if (!user) return <Navigate to="/login" />;

  // Else allow access
  return children;
};

export default ProtectedRoute; 