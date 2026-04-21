import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import * as api from "../../api/instructorApi";
import ConfirmModal from "../../Components/Instructor/ConfirmModal";

export default function InstructorFeedback() {
  const { pushToast } = useOutletContext();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingCourses(true);
      try {
        const { data } = await api.getMyCourses({ page: 1, limit: 50 });
        if (!cancelled) {
          setCourses(data.courses || []);
          if (data.courses?.[0]?._id) setActiveId(data.courses[0]._id);
        }
      } catch (e) {
        if (!cancelled) pushToast(e.response?.data?.message || "Failed to load courses", "err");
      } finally {
        if (!cancelled) setLoadingCourses(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pushToast]);

  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    (async () => {
      setLoadingComments(true);
      try {
        const { data } = await api.getCourseComments(activeId);
        if (!cancelled) setComments(data.comments || []);
      } catch (e) {
        if (!cancelled) pushToast(e.response?.data?.message || "Failed to load comments", "err");
      } finally {
        if (!cancelled) setLoadingComments(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeId, pushToast]);

  const remove = async () => {
    if (!deleteId) return;
    try {
      await api.deleteComment(deleteId);
      pushToast("Comment removed");
      setDeleteId(null);
      const { data } = await api.getCourseComments(activeId);
      setComments(data.comments || []);
    } catch (e) {
      pushToast(e.response?.data?.message || "Delete failed", "err");
    }
  };

  const activeCourse = courses.find((c) => c._id === activeId);

  return (
    <>
      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete comment?"
        message="This feedback will be removed permanently."
        confirmLabel="Delete"
        danger
        onClose={() => setDeleteId(null)}
        onConfirm={remove}
      />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(200px, 280px) 1fr", gap: 20 }}>
        <div className="inst-panel">
          <h3 className="inst-panel-title" style={{ marginBottom: 12 }}>
            Your courses
          </h3>
          {loadingCourses ? (
            <div className="inst-skeleton" style={{ height: 120 }} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {courses.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => setActiveId(c._id)}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border:
                      c._id === activeId
                        ? "1px solid rgba(167,139,250,0.5)"
                        : "1px solid rgba(255,255,255,0.08)",
                    background:
                      c._id === activeId ? "rgba(124,58,237,0.15)" : "rgba(0,0,0,0.25)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  {c.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="inst-panel">
          <h3 className="inst-panel-title" style={{ marginBottom: 12 }}>
            Comments {activeCourse ? `· ${activeCourse.title}` : ""}
          </h3>
          {loadingComments ? (
            <div className="inst-skeleton" style={{ height: 160 }} />
          ) : (
            <div className="inst-table-wrap">
              <table className="inst-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {comments.map((cm) => (
                    <tr key={cm._id}>
                      <td>{cm.user?.name || "—"}</td>
                      <td style={{ maxWidth: 360 }}>{cm.text}</td>
                      <td style={{ color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
                        {cm.createdAt ? new Date(cm.createdAt).toLocaleString() : "—"}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="inst-link"
                          style={{ border: "none", background: "none", cursor: "pointer", color: "#fca5a5" }}
                          onClick={() => setDeleteId(cm._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loadingComments && comments.length === 0 && (
            <p style={{ color: "rgba(255,255,255,0.45)" }}>No comments on this course yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
