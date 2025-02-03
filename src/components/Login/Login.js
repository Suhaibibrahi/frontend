// src/components/Login/Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Clear any existing session on mount
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setError(false);

    // Basic validation
    if (!email || !password) {
      setFeedback('All security fields must be completed.');
      setError(true);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFeedback('Invalid operator identification format.');
      setError(true);
      return;
    }
    if (password.length < 8) {
      setFeedback('Security protocol requires minimum 8 character cipher.');
      setError(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/login',
        {
          email: email.toLowerCase().trim(),
          password: password.trim(),
        },
        { timeout: 10000, headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.data?.user?.role || !response.data?.token) {
        throw new Error('Invalid authentication response from command center');
      }

      const { token, user } = response.data;

      // Store token & user in local storage
      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: user.email,
          role: user.role,
          name: user.name,
          id: user.id,
        })
      );

      // Notify parent of successful login
      onLogin(token, user);

      // Show success feedback and redirect
      setFeedback('Authentication sequence complete. Initializing dashboard...');
      setTimeout(() => {
        navigate(user.role === 'admin' ? '/admin-dashboard' : '/dashboard');
      }, 1500);
    } catch (err) {
      let errorMessage = 'Security protocol violation. Access denied.';
      if (err.response?.data?.message) {
        // Server-provided error
        errorMessage = err.response.data.message;
      } else if (err.request) {
        // Request made, no response
        errorMessage = 'Connection to command center failed. Check your network.';
      } else {
        // Something else triggered an error
        errorMessage = 'Critical system error. Contact technical support.';
      }

      setFeedback(errorMessage);
      setError(true);

      // Clear local storage if credentials compromised
      if (err.response?.status >= 400) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setPassword('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Top header with gold welcome text */}
      <header className="top-header">
        <h1 className="welcome-message">
          Welcome to the 23rd Tactical Airlift Squadron App
        </h1>
        <p className="welcome-subtitle">
          Ensuring mission readiness with streamlined operations
        </p>
      </header>

      {/* Main area (login box) */}
      <main className="login-main">
        <div className="login-box">
          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="email">OPERATOR IDENTIFICATION</label>
            <input
              id="email"
              type="email"
              placeholder="Enter military email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />

            <label htmlFor="password">ENCRYPTION KEY</label>
            <input
              id="password"
              type="password"
              placeholder="Enter security cipher"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <div className="tactical-spinner" aria-label="Validating credentials" />
              ) : (
                'INITIATE AUTHENTICATION'
              )}
            </button>
          </form>

          {feedback && (
            <div className={`login-message ${error ? 'error' : 'success'}`}>
              {feedback}
            </div>
          )}

          <div className="login-links">
            <Link to="/forgot-password">▶ Encryption Key Recovery Protocol</Link>
            <Link to="/register">▶ New Operator Registration</Link>
          </div>
        </div>
      </main>

      {/* Version label bottom-left */}
      <div className="version-label">Mission Control System v2.4.1</div>

      {/* Signature bottom-right */}
      <div className="signature">Tactical Interface Design: Suhaib Al-Khafaji</div>
    </div>
  );
}

export default Login;
