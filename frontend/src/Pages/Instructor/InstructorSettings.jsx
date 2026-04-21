import { Link } from "react-router-dom";

export default function InstructorSettings() {
  return (
    <div className="inst-panel" style={{ maxWidth: 560 }}>
      <h2 className="inst-panel-title" style={{ marginBottom: 12 }}>
        Settings
      </h2>
      <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 20 }}>
        Account security and profile details are managed from your public profile page (name,
        email, avatar, bio).
      </p>
      <Link to="/profile" className="inst-btn-primary" style={{ display: "inline-flex" }}>
        Open profile
      </Link>
    </div>
  );
}
