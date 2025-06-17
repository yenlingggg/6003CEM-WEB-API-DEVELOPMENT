// client/src/pages/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import loginBg from '../assets/login-bg.svg';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const rawToken = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [message, setMessage]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [tokenValid, setTokenValid] = useState(null); 

  // Verify token on mount
  useEffect(() => {
    async function verify() {
      if (!rawToken) {
        setTokenValid(false);
        return;
      }
      try {
        const res = await api.get(`/api/auth/verify-reset-token?token=${rawToken}`);
        setTokenValid(res.data.valid);
      } catch {
        setTokenValid(false);
      }
    }
    verify();
  }, [rawToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirm) {
      setError('Please fill out both fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/reset-password', { token: rawToken, password });
      setMessage(res.data.message || 'Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('Reset error:', err);
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return <LoadingSpinner />;
  }

  return (
    <div className="login-background">
      {loading && <LoadingSpinner />}
      <div className="login-container">
        <h1 className="login-title">
          {tokenValid ? 'Reset Password' : 'Link Expired'}
        </h1>

        {tokenValid ? (
          message ? (
            <p className="success-text">{message}</p>
          ) : (
            <form onSubmit={handleSubmit} className="login-form">
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="login-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >
                Reset Password
              </button>
              {error && <p className="error-text">{error}</p>}
            </form>
          )
        ) : (
          <p className="error-text">
            This reset link is invalid or has expired.
          </p>
        )}
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
        }
      `}</style>
    </div>
  );
}
