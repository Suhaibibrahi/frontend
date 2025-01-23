// src/components/Sidebar/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  // Check if the user is logged in by validating the presence of an email
  const isLoggedIn = !!localStorage.getItem('userEmail');

  if (!isLoggedIn) {
    return null; // Don't render Sidebar if not logged in
  }

  return (
    <div className="sidebar">
      <h2>Squadron App</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/users-status">Users Status</Link></li>
        <li><Link to="/maintenance-status">Maintenance Status</Link></li>
        <li><Link to="/crew-status">Crew Status</Link></li>
        <li><Link to="/schedules">Schedules</Link></li>
        <li><Link to="/files">Files</Link></li>
        <li><Link to="/flight-bulletin">Flight Bulletin</Link></li>
        <li><Link to="/safety-reads">Safety Reads</Link></li>
        <li><Link to="/training">Training</Link></li>
        <li><Link to="/mission-planning">Mission Planning</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
