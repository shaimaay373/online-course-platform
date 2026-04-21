import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import * as api from "../../api/instructorApi";
import ConfirmModal from "../../Components/Instructor/ConfirmModal";

const emptyLesson = {
  title: "",
  content: "",
  duration: "",
  order: "",
  isPreview: false,
};

export default function InstructorCourseDetail() {
  const { courseId } = useParams();
  const { pushToast } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [lessonModal, setLessonModal] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [lessonSaving, setLessonSaving] = useState(false);
  const [deleteLessonId, setDeleteLessonId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.getCourse(courseId);
      setCourse(data.course || data);
      setLessons(data.lessons || []);
    } catch (e) {
      pushToast(e.response?.data?.message || "Failed to load course", "err");
    } finally {
      setLoading(false);
    }
  }, [courseId, pushToast]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditingLessonId(null);
    setLessonForm(emptyLesson);
    setLessonModal(true);
  };

  const openEdit = (lesson) => {
    setEditingLessonId(lesson._id);
    setLessonForm({
      title: lesson.title,
      content: lesson.content,
      duration: String(lesson.duration),
      order: lesson.order != null ? String(lesson.order) : "",
      isPreview: Boolean(lesson.isPreview),
    });
    setLessonModal(true);
  };

  const saveLesson = async (e) => {
    e.preventDefault();
    setLessonSaving(true);
    try {
      const payload = {
        title: lessonForm.title,
        content: lessonForm.content,
        duration: Number(lessonForm.duration),
        order: lessonForm.order ? Number(lessonForm.order) : undefined,
        isPreview: lessonForm.isPreview,
      };
      if (editingLessonId) {
        await api.updateLesson(editingLessonId, payload);
        pushToast("Lesson updated");
      } else {
        await api.createLesson(courseId, payload);
        pushToast("Lesson created");
      }
      setLessonModal(false);
      load();
    } catch (e) {
      const msg =
        e.response?.data?.errors?.map((x) => x.msg).join(" ") ||
        e.response?.data?.message ||
        "Lesson save failed";
      pushToast(msg, "err");
    } finally {
      setLessonSaving(false);
    }
  };

  const removeLesson = async () => {
    if (!deleteLessonId) return;
    try {
      await api.deleteLesson(deleteLessonId);
      pushToast("Lesson deleted");
      setDeleteLessonId(null);
      load();
    } catch (e) {
      pushToast(e.response?.data?.message || "Delete failed", "err");
    }
  };

  if (loading && !course) {
    return <div className="inst-skeleton" style={{ height: 240 }} />;
  }

  return (
    <>
      <ConfirmModal
        open={Boolean(deleteLessonId)}
        title="Delete this lesson?"
        message="Students will lose access to this lesson content."
        confirmLabel="Delete"
        danger
        onClose={() => setDeleteLessonId(null)}
        onConfirm={removeLesson}
      />

      {lessonModal && (
        <div className="inst-modal-backdrop" onClick={() => !lessonSaving && setLessonModal(false)}>
          <div className="inst-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <h3 className="inst-modal-title">
              {editingLessonId ? "Edit lesson" : "Add lesson"}
            </h3>
            <form className="inst-form-grid" onSubmit={saveLesson} style={{ marginTop: 12 }}>
              <div className="inst-field">
                <label>Title</label>
                <input
                  className="inst-input"
                  required
                  minLength={5}
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                />
              </div>
              <div className="inst-field">
                <label>Content</label>
                <textarea
                  className="inst-textarea"
                  required
                  minLength={20}
                  rows={4}
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="inst-field">
                  <label>Duration (minutes)</label>
                  <input
                    className="inst-input"
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                  />
                </div>
                <div className="inst-field">
                  <label>Order</label>
                  <input
                    className="inst-input"
                    type="number"
                    min={1}
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm({ ...lessonForm, order: e.target.value })}
                  />
                </div>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={lessonForm.isPreview}
                  onChange={(e) => setLessonForm({ ...lessonForm, isPreview: e.target.checked })}
                />
                Free preview lesson
              </label>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="inst-btn-secondary"
                  onClick={() => setLessonModal(false)}
                  disabled={lessonSaving}
                >
                  Cancel
                </button>
                <button type="submit" className="inst-btn-primary" disabled={lessonSaving}>
                  {lessonSaving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <Link to="/dashboard/courses" className="inst-link">
          ← Back to courses
        </Link>
      </div>

      <div className="inst-panel" style={{ marginBottom: 20 }}>
        <div className="inst-panel-head">
          <h2 className="inst-panel-title">{course?.title}</h2>
          <div className="inst-actions">
            <Link className="inst-btn-secondary" to={`/dashboard/courses/${courseId}/edit`} style={{ textDecoration: "none" }}>
              Edit course
            </Link>
            <Link className="inst-btn-primary" to={`/courses/${courseId}`} style={{ textDecoration: "none" }}>
              Public page
            </Link>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.55)", margin: "0 0 12px", lineHeight: 1.5 }}>
          {course?.description}
        </p>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          <span className={`inst-badge ${course?.isPublished ? "inst-badge--pub" : "inst-badge--draft"}`}>
            {course?.isPublished ? "Published" : "Draft"}
          </span>
          <span style={{ marginLeft: 12 }}>Category: {course?.category}</span>
          <span style={{ marginLeft: 12 }}>Level: {course?.level}</span>
          <span style={{ marginLeft: 12 }}>Price: ${Number(course?.price || 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="inst-panel">
        <div className="inst-panel-head">
          <h2 className="inst-panel-title">Lessons</h2>
          <button type="button" className="inst-btn-primary" onClick={openAdd}>
            + Add lesson
          </button>
        </div>
        <div className="inst-table-wrap">
          <table className="inst-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Duration</th>
                <th>Order</th>
                <th>Preview</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lessons.map((l) => (
                <tr key={l._id}>
                  <td style={{ fontWeight: 600 }}>{l.title}</td>
                  <td>{l.duration}</td>
                  <td>{l.order ?? "—"}</td>
                  <td>{l.isPreview ? "Yes" : "No"}</td>
                  <td>
                    <div className="inst-actions">
                      <button type="button" className="inst-link" style={{ border: "none", background: "none", cursor: "pointer" }} onClick={() => openEdit(l)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inst-link"
                        style={{ border: "none", background: "none", cursor: "pointer", color: "#fca5a5" }}
                        onClick={() => setDeleteLessonId(l._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {lessons.length === 0 && !loading && (
          <p style={{ color: "rgba(255,255,255,0.45)" }}>No lessons yet. Add your first lesson.</p>
        )}
      </div>
    </>
  );
}
