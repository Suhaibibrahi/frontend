// src/components/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  const location = useLocation();

  // Check if user exists and has a valid role
  if (!user?.role) {
    return <Navigate 
      to="/login" 
      state={{ 
        from: location,
        message: 'Please login to access this page' 
      }} 
      replace 
    />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate
      to="/unauthorized"
      state={{
        from: location,
        error: `Requires ${allowedRoles.join(' or ')} privileges`
      }}
      replace
    />;
  }

  return children;
};

export default ProtectedRoute;