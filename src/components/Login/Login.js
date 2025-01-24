// src/components/Login/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setFeedback('');
    setError(false);

    // Step 1: Basic validation
    if (!email || !password) {
      setFeedback('Please fill in both fields.');
      setError(true);
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setFeedback('Please enter a valid email address.');
      setError(true);
      return;
    }

    if (password.length < 8) {
      setFeedback('Password must be at least 8 characters.');
      setError(true);
      return;
    }

    setIsLoading(true); // Show loading spinner

    try {
      // Step 2: Send login request to backend
      const response = await axios.post('http://localhost:5000/login', {
        email: email.toLowerCase().trim(),
        password: password.trim(),
      }, {
        timeout: 10000, // 10-second timeout
      });

      // Step 3: Validate server response
      if (!response.data?.user || !response.data?.token) {
        throw new Error('Invalid server response format');
      }

      const { token, user } = response.data;

      // Step 4: Validate user role
      if (!['user', 'admin'].includes(user.role)) {
        throw new Error('Invalid user role received');
      }

      // Step 5: Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Step 6: Update parent component state
      onLogin(token, user);

      // Step 7: Show success message and redirect
      setFeedback('Login successful! Redirecting...');
      setError(false);

      setTimeout(() => {
        navigate(user.role === 'admin' ? '/admin-dashboard' : '/dashboard');
      }, 1500);

    } catch (err) {
      // Step 8: Handle errors
      let errorMessage = 'Login failed. Please try again.';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.request) {
        errorMessage = 'No response from server. Check your connection.';
      } else if (err.message.includes('Invalid')) {
        errorMessage = 'System error: Invalid login response.';
      }

      setFeedback(errorMessage);
      setError(true);

      // Clear sensitive data on critical errors
      if (err.response?.status >= 500 || err.message.includes('Invalid')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setPassword('');
      }
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="welcome-message">Welcome to the 23rd Tactical Airlift Squadron App</h1>
        <p className="sub-heading">Ensuring mission readiness with streamlined operations</p>
      </header>

      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-heading">Login</h2>

          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email Address</label>
            <input
              type="email"
              id="email"
              className="input-field"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <div className="spinner" aria-label="Authenticating" />
            ) : 'Login'}
          </button>

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <Link
              to="/forgot-password"
              className="forgot-password-link"
              aria-disabled={isLoading}
            >
              Forgot Password?
            </Link>
          </div>
        </form>

        {/* Feedback Message */}
        {feedback && (
          <div
            className={`feedback-container ${error ? 'error' : 'success'}`}
            role="alert"
            aria-live="polite"
          >
            <p className="feedback-text">
              {error ? '⚠️ ' : '✅ '}
              {feedback}
            </p>
          </div>
        )}

        {/* Register Link */}
        <div className="navigate-register">
          Don't have an account? {' '}
          <Link to="/register" className="register-link">
            Register here
          </Link>
        </div>
      </div>

      {/* Signature */}
      <div className="signature">
        Designed by Suhaib Al-Khafaji
      </div>
    </div>
  );
}

export default Login;