import React, { useContext, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Navbar.css";

export default function Navbar() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">LearnHub</Link>

      <div className="navbar-links">
        <Link to="/courses" className="nav-link">Courses</Link>
        <Link to="/instructors" className="nav-link">Instructors</Link>
        <Link to="/resources" className="nav-link">Resources</Link>
      </div>

      <div className="navbar-actions">
        {token && user ? (
          <>
            <button type="button" className="nav-icon-btn" aria-label="Cart">
              <i className="bi bi-cart3" />
            </button>
            <button type="button" className="nav-icon-btn" aria-label="Notifications">
              <i className="bi bi-bell" />
            </button>
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
                  <span className="nav-user-avatar">{user.name?.charAt(0)?.toUpperCase() || "U"}</span>
                )}
                <i className="bi bi-chevron-down nav-user-chevron" />
              </button>
              {menuOpen && (
                <div className="nav-user-dropdown">
                  {user.role === "instructor" && (
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
