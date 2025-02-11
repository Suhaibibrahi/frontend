// src/components/Sidebar/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <button onClick={() => setCollapsed(!collapsed)} className="toggle-button">
        {collapsed ? '☰' : '✕'}
      </button>
      {!collapsed && (
        <>
          <h2>Squadron App</h2>
          <p>Welcome, {user.name}!</p>
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
          <button onClick={onLogout} className="logout-button">Logout</button>
        </>
      )}
    </div>
  );
}

export default Sidebar;
