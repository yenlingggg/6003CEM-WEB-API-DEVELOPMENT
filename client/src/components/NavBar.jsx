// client/src/components/NavBar.jsx
import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './NavBar.css';

export default function NavBar() {
  const { user, logout, token } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : '';


  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="title">CryptoTracker</div>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Home
        </NavLink>
        <NavLink
          to="/news"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          News
        </NavLink>
        <NavLink
          to="/saved"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Favorites
        </NavLink>
      </div>

      {token && (
        <div className="nav-right" ref={menuRef}>
          <div
            className="profile-avatar"
            onClick={() => setOpen((o) => !o)}
          >
            {initial}
          </div>
          {open && (
            <div className="profile-dropdown">
              <p className="dropdown-name">{user.username}</p>
              <p className="dropdown-email">{user.email}</p>
              <button
                className="dropdown-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
