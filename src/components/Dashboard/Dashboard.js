// src/components/Dashboard/Dashboard.js
import React from 'react';
import ScheduleGrid from '../ScheduleGrid/ScheduleGrid';
import './Dashboard.css';

function Dashboard({ user }) {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Welcome, {user.name}!</h1>
      <p className="dashboard-subtitle">
      Access all your important data and tools here. Stay organized and mission-ready.
      </p>
      {/* Include the schedule grid */}
      <ScheduleGrid />
    </div>
  );
}

export default Dashboard;
