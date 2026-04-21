import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import * as api from "../../api/instructorApi";

export default function InstructorStudents() {
  const { pushToast } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.getInstructorEnrollments();
        if (!cancelled) setRows(data.enrollments || []);
      } catch (e) {
        if (!cancelled) pushToast(e.response?.data?.message || "Failed to load students", "err");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pushToast]);

  return (
    <div className="inst-panel">
      <div className="inst-panel-head">
        <h2 className="inst-panel-title">Students</h2>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          Enrollments across your courses
        </p>
      </div>
      {loading ? (
        <div className="inst-skeleton" style={{ height: 160 }} />
      ) : (
        <div className="inst-table-wrap">
          <table className="inst-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Course</th>
                <th>Status</th>
                <th>Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 600 }}>{r.user?.name || "—"}</td>
                  <td style={{ color: "rgba(255,255,255,0.5)" }}>{r.user?.email || "—"}</td>
                  <td>{r.course?.title || "—"}</td>
                  <td>{r.status}</td>
                  <td style={{ color: "rgba(255,255,255,0.45)" }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && rows.length === 0 && (
        <p style={{ color: "rgba(255,255,255,0.45)" }}>No enrollments yet.</p>
      )}
    </div>
  );
}
