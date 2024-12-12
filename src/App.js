import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './Register';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setFeedback('Please fill in both fields.');
      return;
    }

    setIsLoading(true);
    setFeedback(''); // Clear previous feedback
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      setFeedback(response.data.message);
      setError(false); // Reset error state on success
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setFeedback('Invalid email or password.');
        } else if (err.response.status === 400) {
          setFeedback('Please provide a valid email and password.');
        } else {
          setFeedback('An unexpected error occurred. Please try again.');
        }
      } else {
        setFeedback('Unable to connect to the server. Please check your connection.');
      }
      setError(true); // Set error state on failure
    } finally {
      setIsLoading(false); // Reset loading state
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
          <h2 className="login-heading"> Login</h2>

          {/* Email Field */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email Address</label>
            <input
              type="email"
              id="email"
              className="input-field"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {/* Forgot Password Link */}
          <div className="forgot-password">
          <a href="/reset-password">Forgot Password?</a> {/* Replace with a valid path */}
          </div>
        </form>

        {/* Feedback Message */}
        {feedback && (
          <p className={`feedback-message ${error ? 'error' : 'success'}`}>
            {feedback}
          </p>
        )}

        {/* Link to Registration */}
        <div className="navigate-register">
          Don't have an account? <Link to="/register">Register here</Link>.
        </div>
      </div>

      <div className="signature">
        Designed by Suhaib Al-Khafaji
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
