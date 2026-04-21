import { useCallback, useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import InstructorSidebar from "../../Components/Instructor/InstructorSidebar";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./instructor.css";

export default function InstructorLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((message, variant = "ok") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="inst-shell">
      <InstructorSidebar />
      <div className="inst-main">
        <header className="inst-header">
          <div>
            <h1>Instructor Studio</h1>
            <p className="inst-header-sub">Manage courses, lessons, and learners</p>
          </div>
          <div className="inst-header-user">
            <div className="inst-avatar-sm">
              {user?.avatar ? (
                <img src={user.avatar} alt="" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || "I"
              )}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.name}</div>
              <button
                type="button"
                className="inst-link"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </header>
        <div className="inst-content">
          <Outlet context={{ pushToast }} />
        </div>
      </div>
      <div className="inst-toast-host" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`inst-toast inst-toast--${t.variant}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
