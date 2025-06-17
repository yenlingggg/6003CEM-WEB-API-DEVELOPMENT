// src/pages/Register.jsx

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import registerBg from '../assets/login-bg.svg';

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/api/auth/register', { username, email, password });
      login(res.data.token);
      setMessage('Registration Successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-background">
      {loading && <LoadingSpinner />}
      <div className="register-container">
        <h1 className="register-title">Register</h1>
        {message ? (
          <p className="success-text">{message}</p>
        ):(
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
          />
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="register-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="password-input-container">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="register-input"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="password-toggle"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="register-button"
          >
            Register
          </button>
        </form>
        )}
        <p className="toggle-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>

      <style jsx>{`
        .register-background {
          min-height: 100vh;
          min-width: 100vw;
          background: url(${registerBg}) no-repeat center center / cover;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .register-container {
          width: 100%;
          max-width: 400px;
          background-color: rgba(31, 41, 55, 0.85);
          border-radius: 8px;
          padding: 2rem 1.5rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          text-align: center;
          margin: 2rem;
        }
        .register-title {
          margin: 0 0 1.5rem 0;
          color: #e5e7eb;
          font-size: 1.5rem;
          font-weight: 500;
        }
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .password-input-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
        }
        .register-input {
          padding: 0.75rem 1rem;
          border: 1px solid #374151;
          border-radius: 6px;
          background-color: #1f2937;
          color: #e5e7eb;
          font-size: 1rem;
          width: 100%;
          box-sizing: border-box;
        }
        .register-input::placeholder {
          color: #9ca3af;
        }
        .password-toggle {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 5px;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
          transition: opacity 0.2s;
          height: 100%;
        }
        .password-toggle:hover {
          opacity: 1;
        }
        .register-button {
          background-color: #2563eb;
          color: #ffffff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
        }
        .register-button:disabled {
          background-color: #4b5563;
          cursor: not-allowed;
        }
        .error-text {
          color: #f87171;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
        .success-text {
          color: #34d399;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .toggle-text {
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #9ca3af;
        }
        .toggle-text a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }
        .toggle-text a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
