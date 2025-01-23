// src/components/Register/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showContactMessage, setShowContactMessage] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setFeedback('Please fill in both fields.');
      setError(true);
      return;
    }

    setIsLoading(true);
    setFeedback('');

    try {
      const response = await axios.post('http://localhost:5000/register', {
        email,
        password,
      });
      setFeedback(response.data.message);
      setError(false);
      setShowContactMessage(true);
    } catch (err) {
      setFeedback(err.response ? err.response.data.message : 'An error occurred. Please try again.');
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Register</h2>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <small>Password must be at least 8 characters long and include one letter and one number.</small>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        {feedback && (
          <p className={`feedback-message ${error ? 'error' : 'success'}`}>
            {feedback}
          </p>
        )}
      </form>

      {showContactMessage && (
        <div className="contact-message">
          <h3>Contact Admin</h3>
          <p>
            Your account is pending admin approval. If you need immediate assistance,
            please contact the admin at <a href="tel:+9647717512709">+9647717512709</a>.
          </p>
        </div>
      )}
    </div>
  );
}

export default Register;
