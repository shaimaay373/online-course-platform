import { useCallback, useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import * as api from "../../api/instructorApi";
import ConfirmModal from "../../Components/Instructor/ConfirmModal";

export default function InstructorMyCourses() {
  const { pushToast } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const { data } = await api.getMyCourses({
          page,
          limit: 10,
          search: search.trim() || undefined,
          category: category || undefined,
        });
        setCourses(data.courses || []);
        setPagination({
          page: data.pagination?.currentPage || 1,
          totalPages: data.pagination?.totalPages || 1,
        });
      } catch (e) {
        pushToast(e.response?.data?.message || "Failed to load courses", "err");
      } finally {
        setLoading(false);
      }
    },
    [search, category, pushToast]
  );

  useEffect(() => {
    load(1);
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    load(1);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.deleteCourse(deleteId);
      pushToast("Course deleted");
      setDeleteId(null);
      load(pagination.page);
    } catch (e) {
      pushToast(e.response?.data?.message || "Delete failed", "err");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete course?"
        message="This removes the course and you will lose associated lesson links. Enrollments may become inconsistent — use with care."
        confirmLabel="Delete"
        danger
        busy={deleting}
        onClose={() => !deleting && setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      <div className="inst-panel">
        <div className="inst-panel-head">
          <h2 className="inst-panel-title">My courses</h2>
          <div className="inst-toolbar">
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
              <input
                className="inst-input"
                placeholder="Search title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="inst-btn-secondary">
                Search
              </button>
            </form>
            <select
              className="inst-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
            </select>
            <Link to="/dashboard/courses/new" className="inst-btn-primary">
              + New course
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="inst-skeleton" style={{ height: 200 }} />
        ) : (
          <div className="inst-table-wrap">
            <table className="inst-table">
              <thead>
                <tr>
                  <th />
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id}>
                    <td>
                      {c.thumbnail ? (
                        <img className="inst-thumb" src={c.thumbnail} alt="" />
                      ) : (
                        <div className="inst-thumb" />
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td>{c.category}</td>
                    <td>${Number(c.price).toFixed(2)}</td>
                    <td>{c.studentsCount ?? 0}</td>
                    <td>
                      <span
                        className={`inst-badge ${
                          c.isPublished ? "inst-badge--pub" : "inst-badge--draft"
                        }`}
                      >
                        {c.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td style={{ color: "rgba(255,255,255,0.45)" }}>—</td>
                    <td>
                      <div className="inst-actions">
                        <Link className="inst-link" to={`/dashboard/courses/${c._id}`}>
                          Details
                        </Link>
                        <Link className="inst-link" to={`/dashboard/courses/${c._id}/edit`}>
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="inst-link"
                          style={{ background: "none", border: "none", cursor: "pointer" }}
                          onClick={() => setDeleteId(c._id)}
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
        )}

        {!loading && courses.length === 0 && (
          <p style={{ color: "rgba(255,255,255,0.45)" }}>No courses match your filters.</p>
        )}

        {pagination.totalPages > 1 && (
          <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="inst-btn-secondary"
              disabled={pagination.page <= 1 || loading}
              onClick={() => load(pagination.page - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="inst-btn-secondary"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => load(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
