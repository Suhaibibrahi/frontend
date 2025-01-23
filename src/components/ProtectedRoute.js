// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, role, ...rest }) => {
  const userRole = localStorage.getItem('userRole');

  // Check if user is logged in and has the required role
  if (!userRole) {
    // If no user role is stored in local storage, redirect to the login page
    return <Navigate to="/" replace />;
  }

  if (userRole !== role) {
    // If the user's role doesn't match the required role, redirect to unauthorized or login
    return <Navigate to="/" replace />;
  }

  // If the user role matches, render the requested component
  return <Component {...rest} />;
};

export default ProtectedRoute;
