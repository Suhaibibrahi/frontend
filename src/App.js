// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Sidebar from './components/Sidebar/Sidebar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ForgotPassword from './components/ForgotPassword/forgot-password';
import ResetPassword from './components/ResetPassword/reset-password';
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import UsersStatus from './components/UsersStatus/UsersStatus';
import ProtectedRoute from './components/ProtectedRoute'; // ProtectedRoute component

function App() {
  const isLoggedIn = !!localStorage.getItem('userEmail'); // Check if user is logged in

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Sidebar only visible when user is logged in */}
        {isLoggedIn && <Sidebar />}

        {/* Main content area */}
        <div style={{ marginLeft: isLoggedIn ? '250px' : '0', padding: '20px', width: '100%' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute component={Dashboard} role="user" />}
            />
            <Route
              path="/admin-dashboard"
              element={<ProtectedRoute component={AdminDashboard} role="admin" />}
            />
            <Route
              path="/users-status"
              element={<ProtectedRoute component={UsersStatus} role="admin" />}
            />

            {/* Placeholder routes for future features */}
            <Route path="/maintenance-status" element={<div>Maintenance Status</div>} />
            <Route path="/crew-status" element={<div>Crew Status</div>} />
            <Route path="/schedules" element={<div>Schedules</div>} />
            <Route path="/files" element={<div>Files</div>} />
            <Route path="/flight-bulletin" element={<div>Flight Bulletin</div>} />
            <Route path="/safety-reads" element={<div>Safety Reads</div>} />
            <Route path="/training" element={<div>Training</div>} />
            <Route path="/mission-planning" element={<div>Mission Planning</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
