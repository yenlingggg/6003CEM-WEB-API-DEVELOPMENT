// client/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // load token & user from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser]   = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) return JSON.parse(stored);
      if (token) return jwtDecode(token);
      return null;
    } catch {
      return null;
    }
  });

  // when token changes, decode and save user info
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // decoded now contains { id, username, email, iat, exp }
        setUser(decoded);
        localStorage.setItem('user', JSON.stringify({
          id:       decoded.id,
          username: decoded.username,
          email:    decoded.email
        }));
        // expire
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        }
      } catch {
        logout();
      }
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }
  }, [token]);

  const login = (jwtToken, userObj) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userObj));
    setToken(jwtToken);
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
