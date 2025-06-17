// client/src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import SavedCoins from './pages/SavedCoins';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './pages/News';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';

/**
 * `useLocation()` here can check the current pathname
 * and decide whether to render <NavBar /> or not.
 */
function AppContent() {
  const location = useLocation();
  const path = location.pathname;

  // Hide the NavBar on /login and /register
  const hideNav = path === '/login' || path === '/register' || path === '/reset-password' || path === '/forgot-password';

  return (
    <>
      {/* Conditionally render NavBar only when we're not on the login/register pages */}
      {!hideNav && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saved" element={<SavedCoins />} />
        <Route path="/news" element={<News />} />
        {/* Public routes (no NavBar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Fallback: redirect any unknown URL back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
