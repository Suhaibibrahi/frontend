import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';            // global CSS
import App from './App';         // main App component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional performance measuring
reportWebVitals();
