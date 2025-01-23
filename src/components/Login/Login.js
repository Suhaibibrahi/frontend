// src/components/Login/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // put your CSS

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setError(false);

    // Minimal checks
    if (!email || !password) {
      setFeedback('Please fill in both fields.');
      setError(true);
      return;
    }
    if (!email.includes('@')) {
      setFeedback('Invalid email format.');
      setError(true);
      return;
    }
    if (password.length < 8) {
      setFeedback('Password must be at least 8 characters long.');
      setError(true);
      return;
    }

    setIsLoading(true);
    setFeedback('');

    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });

      if (response.status === 200) {
        const userRole = response.data.role;
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', userRole);

        setFeedback('Login successful!');
        setError(false);

        // Navigate based on role
        if (userRole === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
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
      setError(true);
    } finally {
      setIsLoading(false);
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

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : 'Login'}
          </button>

          <div className="forgot-password" style={{ marginTop: '10px' }}>
            <Link to="/forgot-password" style={{ textDecoration: 'underline', color: 'orange' }}>
              Forgot Password?
            </Link>
          </div>
        </form>

        {feedback && (
          <p className={`feedback-message ${error ? 'error' : 'success'}`}>
            {feedback}
          </p>
        )}

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

export default Login;
