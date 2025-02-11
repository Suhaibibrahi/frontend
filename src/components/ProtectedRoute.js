// src/components/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  const location = useLocation();

  // Check if user exists and has a valid role
  if (!user?.role) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location,
          message: 'Please login to access this page' 
        }} 
        replace 
      />
    );
  }

  // Check if user has the required role for this route
  if (!allowedRoles.includes(user.role)) {
    // If the user does not have the allowed role, then:
    if (user.role === 'owner' || user.role === 'admin') {
      // For owner or admin, redirect to the admin dashboard.
      return (
        <Navigate
          to="/admindashboard"
          state={{
            from: location,
            error: `Access denied for this page. Redirected to Admin Dashboard.`
          }}
          replace
        />
      );
    } else if (user.role === 'user') {
      // For regular users, redirect to the user dashboard.
      return (
        <Navigate
          to="/dashboard"
          state={{
            from: location,
            error: `Access denied for this page. Redirected to User Dashboard.`
          }}
          replace
        />
      );
    } else {
      // Fallback redirection for any other roles
      return (
        <Navigate
          to="/unauthorized"
          state={{
            from: location,
            error: `Access denied.`
          }}
          replace
        />
      );
    }
  }

  return children;
};

export default ProtectedRoute;
