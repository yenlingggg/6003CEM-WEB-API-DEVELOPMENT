// client/src/pages/Login.jsx

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import loginBg from '../assets/login-bg.svg';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/auth/login', { email, password });
      // On success, save token and redirect
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      {loading && <LoadingSpinner />}
      <div className="login-container">
        <h1 className="login-title">Log In</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            Log In
          </button>
        </form>
        <p className="forgot-text">
          <Link to="/forgot-password" className="forgot-link">
            Forgot Password?
          </Link>
        </p>
        <p className="toggle-text">
          Don't have an account? <Link to="/register">Register</Link>
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
        .password-input-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
        }
        .login-input {
          padding: 0.75rem 1rem;
          border: 1px solid #374151;
          border-radius: 6px;
          background-color: #1f2937;
          color: #e5e7eb;
          font-size: 1rem;
          width: 100%;
          box-sizing: border-box;
        }
        .login-input::placeholder {
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
        .forgot-text {
          margin-top: 0.75rem;
        }
        .forgot-link {
          color: #2563eb;
          text-decoration: none;
          font-size: 0.875rem;
        }
        .forgot-link:hover {
          text-decoration: underline;
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
