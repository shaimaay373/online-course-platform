import React, { useContext, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Navbar.css";

export default function Navbar() {
  const { user, token, logout } = useContext(AuthContext);
  const { notifications, markAllRead, unreadCount } = useNotifications(); 
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false); 
  const menuRef = useRef(null);
  const notifRef = useRef(null); 

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">LearnHub</Link>

      <div className="navbar-links">
        <Link to="/courses" className="nav-link">Courses</Link>
      </div>

      <div className="navbar-actions">
        {token && user ? (
          <>
    

          
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                type="button"
                className="nav-icon-btn"
                aria-label="Notifications"
                onClick={() => {
                  setNotifOpen(o => !o);
                  if (!notifOpen) markAllRead();
                }}
              >
                <i className="bi bi-bell" />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px', right: '4px',
                    width: '16px', height: '16px',
                    background: '#6c6fff',
                    borderRadius: '50%',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '300px',
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                  zIndex: 200,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: '700',
                    fontSize: '14px',
                    color: '#fff',
                  }}>
                    Notifications
                  </div>

                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <p style={{
                        padding: '20px',
                        color: 'rgba(255,255,255,0.35)',
                        fontSize: '13px',
                        textAlign: 'center',
                        margin: 0
                      }}>
                        No notifications yet
                      </p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          fontSize: '13px',
                          color: n.read ? 'rgba(255,255,255,0.45)' : '#fff',
                          background: n.read ? 'transparent' : 'rgba(108,111,255,0.06)',
                          transition: 'background .2s',
                        }}>
                          {n.msg}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="nav-user-wrap" ref={menuRef}>
              <button
                type="button"
                className="nav-user-trigger"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="nav-user-avatar nav-user-avatar--photo" />
                ) : (
                  <span className="nav-user-avatar">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
                <i className="bi bi-chevron-down nav-user-chevron" />
              </button>
              {menuOpen && (
                <div className="nav-user-dropdown">
                  {user.role === 'instructor' && (
                    <Link to="/dashboard" className="nav-dropdown-item" onClick={() => setMenuOpen(false)}>
                      <i className="bi bi-speedometer2" /> Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="nav-dropdown-item" onClick={() => setMenuOpen(false)}>
                    <i className="bi bi-person" /> Profile
                  </Link>
                  <button type="button" className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right" /> Log out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}