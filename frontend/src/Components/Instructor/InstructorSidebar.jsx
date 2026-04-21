import { Link, NavLink } from "react-router-dom";
import "./InstructorSidebar.css";

const links = [
  { to: "/dashboard", end: true, label: "Dashboard", icon: "bi-grid-1x2" },
  { to: "/dashboard/courses", label: "My Courses", icon: "bi-journal-bookmark" },
  { to: "/dashboard/students", label: "Students", icon: "bi-people" },
  { to: "/dashboard/feedback", label: "Reviews", icon: "bi-chat-square-text" },
  { to: "/dashboard/analytics", label: "Analytics", icon: "bi-graph-up-arrow" },
  { to: "/dashboard/settings", label: "Settings", icon: "bi-gear" },
];

export default function InstructorSidebar() {
  return (
    <aside className="inst-sidebar">
      <div className="inst-sidebar-brand">
        <div className="inst-sidebar-title">Instructor Studio</div>
        <div className="inst-sidebar-sub">Premium educator</div>
      </div>

      <nav className="inst-sidebar-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `inst-nav-item ${isActive ? "inst-nav-item--active" : ""}`
            }
          >
            <i className={`bi ${l.icon}`} />
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink to="/dashboard/courses/new" className="inst-sidebar-cta">
        <i className="bi bi-plus-lg" />
        Create Course
      </NavLink>

      <div className="inst-sidebar-footer">
        <Link className="inst-footer-link" to="/">
          <i className="bi bi-house" /> Home
        </Link>
      </div>
    </aside>
  );
}
