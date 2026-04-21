import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import * as api from "../../api/instructorApi";

export default function InstructorAnalytics() {
  const { pushToast } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.getInstructorStats();
        if (!cancelled) setStats(data.stats);
      } catch (e) {
        if (!cancelled) pushToast(e.response?.data?.message || "Could not load analytics", "err");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pushToast]);

  if (loading) {
    return <div className="inst-skeleton" style={{ height: 200 }} />;
  }

  return (
    <div className="inst-panel">
      <h2 className="inst-panel-title" style={{ marginBottom: 8 }}>
        Analytics
      </h2>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
        High-level metrics from your catalog. Detailed charts can be added later.
      </p>
      <div className="inst-grid-stats">
        <div className="inst-stat-card">
          <div className="inst-stat-label">Students</div>
          <div className="inst-stat-value">{stats?.totalStudents ?? 0}</div>
        </div>
        <div className="inst-stat-card">
          <div className="inst-stat-label">Revenue</div>
          <div className="inst-stat-value" style={{ fontSize: 22 }}>
            {(stats?.totalRevenue ?? 0).toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>
        <div className="inst-stat-card">
          <div className="inst-stat-label">Published</div>
          <div className="inst-stat-value">{stats?.activeCourses ?? 0}</div>
        </div>
      </div>
      <Link to="/dashboard" className="inst-link" style={{ marginTop: 16, display: "inline-block" }}>
        ← Back to dashboard
      </Link>
    </div>
  );
}
