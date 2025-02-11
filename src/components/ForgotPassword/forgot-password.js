// src/components/ForgotPassword/ForgotPassword.js
import React, { useState } from 'react';
import './ForgotPassword.css';
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setError('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback(data.message || 'Check your email for a reset link.');
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError('Failed to request password reset. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-pw-container">
      <div className="forgot-pw-box">
        <h1 className="forgot-pw-title">Forgot Password</h1>
        <p className="forgot-pw-subtitle">
          Please enter your account email below, and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="forgot-pw-form">
          <label htmlFor="fp-email">Enter your email:</label>
          <input
            type="email"
            id="fp-email"
            placeholder="Your account email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : 'Send Reset Link'}
          </button>
        </form>

        {feedback && <p className="forgot-pw-success">{feedback}</p>}
        {error && <p className="forgot-pw-error">{error}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
