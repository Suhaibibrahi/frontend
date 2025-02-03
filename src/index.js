import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import './index.css'; // Global CSS
import App from './App'; // Main App component
import reportWebVitals from './reportWebVitals'; // Optional performance measuring

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

// Optional performance measuring
reportWebVitals();
