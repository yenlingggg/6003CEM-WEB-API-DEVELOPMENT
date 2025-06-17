import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import loginBg from '../assets/login-bg.svg';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/forgot-password', { email: email.trim() });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      console.error('Forgot password error:', err);
      if (err.response?.status === 404) {
        setError('No account found with this email address');
      } else {
        setError(err.response?.data?.error || 'Failed to initiate password reset.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      {loading && <LoadingSpinner />}
      <div className="login-container">
        <h1 className="login-title">Forgot Password</h1>
        {message ? (
          <p className="success-text">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              Send Reset Link
            </button>
            {error && <p className="error-text">{error}</p>}
          </form>
        )}
        <p className="toggle-text">
          Remember your password? <Link to="/login">Log in</Link>
        </p>
      </div>

      <style jsx>{`
        .login-background {
          min-height: 100vh;
          min-width: 100vw;
          background: url(${loginBg}) no-repeat center center / cover;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-container {
          width: 100%;
          max-width: 400px;
          background-color: rgba(31, 41, 55, 0.85);
          border-radius: 8px;
          padding: 2rem 1.5rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          text-align: center;
          margin: 2rem;
        }
        .login-title {
          margin: 0 0 1.5rem 0;
          color: #e5e7eb;
          font-size: 1.5rem;
          font-weight: 500;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .login-input {
          padding: 0.75rem 1rem;
          border: 1px solid #374151;
          border-radius: 6px;
          background-color: #1f2937;
          color: #e5e7eb;
          font-size: 1rem;
        }
        .login-input::placeholder {
          color: #9ca3af;
        }
        .login-button {
          background-color: #2563eb;
          color: #ffffff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
        }
        .login-button:disabled {
          background-color: #4b5563;
          cursor: not-allowed;
        }
        .error-text {
          color: #f87171;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
        .success-text {
          color: #4ade80;
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