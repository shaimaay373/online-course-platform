import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import * as api from "../../api/instructorApi";

export default function InstructorDashboard() {
  const { pushToast } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.getInstructorStats();
        if (cancelled) return;
        setStats(data.stats);
        setRecent(data.recentEnrollments || []);
      } catch (e) {
        if (!cancelled) {
          const msg = e.response?.data?.message || "Could not load dashboard.";
          setError(msg);
          pushToast(msg, "err");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pushToast]);

  const fmtMoney = (n) =>
    typeof n === "number"
      ? n.toLocaleString(undefined, { style: "currency", currency: "USD" })
      : "—";

  return (
    <>
      {error && <div className="inst-error-banner">{error}</div>}

      <div className="inst-grid-stats">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="inst-stat-card">
                <div className="inst-skeleton" style={{ width: "40%", marginBottom: 12 }} />
                <div className="inst-skeleton" style={{ width: "55%", height: 32 }} />
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="inst-stat-card">
              <div className="inst-stat-label">Total students</div>
              <div className="inst-stat-value">{stats?.totalStudents ?? 0}</div>
              <div className="inst-stat-meta">Unique learners across your courses</div>
            </div>
            <div className="inst-stat-card">
              <div className="inst-stat-label">Revenue (enrollments × price)</div>
              <div className="inst-stat-value">{fmtMoney(stats?.totalRevenue)}</div>
            </div>
            <div className="inst-stat-card">
              <div className="inst-stat-label">Published courses</div>
              <div className="inst-stat-value">{stats?.activeCourses ?? 0}</div>
              <div className="inst-stat-meta">of {stats?.totalCourses ?? 0} total</div>
            </div>
            <div className="inst-stat-card">
              <div className="inst-stat-label">Average rating</div>
              <div className="inst-stat-value" style={{ fontSize: 22 }}>
                {stats?.averageRating != null ? stats.averageRating : "—"}
              </div>
              <div className="inst-stat-meta">Ratings coming soon</div>
            </div>
          </>
        )}
      </div>

      <div className="inst-panel">
        <div className="inst-panel-head">
          <h2 className="inst-panel-title">Recent enrollments</h2>
          <Link to="/dashboard/students" className="inst-link">
            View all students
          </Link>
        </div>
        {loading ? (
          <div className="inst-skeleton" style={{ height: 120 }} />
        ) : recent.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.45)", margin: 0 }}>No enrollments yet.</p>
        ) : (
          <div className="inst-table-wrap">
            <table className="inst-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((row) => (
                  <tr key={row._id}>
                    <td>{row.user?.name || "—"}</td>
                    <td>{row.course?.title || "—"}</td>
                    <td style={{ color: "rgba(255,255,255,0.45)" }}>
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
