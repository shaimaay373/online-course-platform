import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../Components/Navbar/Navbar";
import "./Profile.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function initialsFromName(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function completedLessonsForStatus(status, total) {
  if (!total || total < 1) return 0;
  if (status === "complete") return total;
  if (status === "active") return Math.min(total, Math.max(1, Math.round(total * 0.25)));
  return 0;
}

export default function Profile() {
  const { user, token, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  const avatarInputRef = useRef(null);
  const [enrollments, setEnrollments] = useState([]);

  const loadProfile = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const [profileRes, enrollRes] = await Promise.all([
        api.get("/users/profile"),
        api.get("/enrollments/my").catch(() => ({ data: { enroll: [] } })),
      ]);

      const u = profileRes.data?.user;
      if (!u) {
        setError("Could not load profile.");
        return;
      }
      setName(u.name || "");
      setEmail(u.email || "");
      setHeadline(u.headline || "");
      setBio(u.bio || "");
      setAvatarUrl(u.avatar || "");
      updateUser(u);

      const raw = enrollRes.data?.enroll || enrollRes.data?.enrollments || [];
      const list = Array.isArray(raw) ? raw : [];

      const withLessons = await Promise.all(
        list.map(async (row) => {
          const courseId = row.course?._id || row.course;
          if (!courseId) return { ...row, lessonTotal: 0, lessonDone: 0 };
          try {
            const cr = await api.get(`/courses/${courseId}`);
            const lessons = cr.data?.lessons || [];
            const total = lessons.length;
            const done = completedLessonsForStatus(row.status, total);
            return {
              ...row,
              lessonTotal: total,
              lessonDone: done,
              courseDetail: cr.data?.course || row.course,
            };
          } catch {
            return { ...row, lessonTotal: 0, lessonDone: 0, courseDetail: row.course };
          }
        })
      );

      setEnrollments(withLessons);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to load profile.";
      setError(msg);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate, updateUser]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadProfile();
  }, [token, navigate, loadProfile]);

  const displayUser = useMemo(
    () => ({
      name: name || user?.name || "Student",
      email: email || user?.email || "",
      headline: headline || user?.headline || "",
      role: user?.role || "student",
      avatar: avatarUrl || user?.avatar || "",
    }),
    [name, email, headline, user, avatarUrl]
  );

  const openAvatarPicker = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG, …).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be at most 5 MB.");
      return;
    }
    setError("");
    setSaveMessage("");
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await api.post("/users/profile/avatar", fd);
      const u = res.data?.user;
      if (u) {
        updateUser(u);
        setAvatarUrl(u.avatar || "");
        setSaveMessage(res.data?.message || "Profile photo updated.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Could not upload photo.";
      setError(msg);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveMessage("");
    setError("");
    setSaving(true);
    try {
      const res = await api.patch("/users/profile", { name, email, headline, bio });
      const u = res.data?.user;
      if (u) updateUser(u);
      setSaveMessage(res.data?.message || "Profile updated.");
    } catch (err) {
      const msg = err.response?.data?.message;
      const errors = err.response?.data?.errors;
      if (Array.isArray(errors) && errors.length) {
        setError(errors.map((x) => x.msg || x.message).join(" "));
      } else {
        setError(msg || "Could not save profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!token) return null;

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-main">
        {loading && <p className="profile-loading">Loading profile…</p>}
        {!loading && error && !name && (
          <p className="profile-error">{error}</p>
        )}

        {!loading && (
          <div className="profile-grid">
            <div className="profile-col profile-col-left">
              <section className="profile-card profile-hero">
                <div className="profile-hero-bg" />
                <div className="profile-avatar-wrap">
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="profile-avatar-file-input"
                    aria-hidden
                    tabIndex={-1}
                    onChange={handleAvatarSelected}
                  />
                  <button
                    type="button"
                    className="profile-avatar-trigger"
                    onClick={openAvatarPicker}
                    disabled={avatarUploading}
                    aria-label="Choose profile photo from your device"
                  >
                    <div className={`profile-avatar-ring ${avatarUploading ? "profile-avatar-ring--busy" : ""}`}>
                      {displayUser.avatar ? (
                        <img src={displayUser.avatar} alt="" className="profile-avatar-img" />
                      ) : (
                        <div className="profile-avatar-fallback">{initialsFromName(displayUser.name)}</div>
                      )}
                    </div>
                  </button>
                  <button
                    type="button"
                    className="profile-avatar-cam"
                    aria-label="Choose profile photo"
                    disabled={avatarUploading}
                    onClick={openAvatarPicker}
                  >
                    <i className="bi bi-camera-fill" />
                  </button>
                </div>
                <span className="profile-badge-premium">
                  <i className="bi bi-gem" />
                  {displayUser.role === "student" ? "Premium Student" : "Instructor"}
                </span>
                <h1 className="profile-name">{displayUser.name}</h1>
                <p className="profile-headline">
                  {displayUser.headline || "Add a short headline in the form below."}
                </p>
              </section>

              <section className="profile-card profile-edit">
                <div className="profile-edit-title">
                  <i className="bi bi-pencil-square" />
                  <h2>Edit Profile</h2>
                </div>
                {(error && name) && <p className="profile-inline-error">{error}</p>}
                {saveMessage && <p className="profile-inline-success">{saveMessage}</p>}
                <form className="profile-form" onSubmit={handleSave}>
                  <label className="profile-field">
                    <span>Full Name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} name="name" required minLength={3} />
                  </label>
                  <label className="profile-field">
                    <span>Email Address</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" required />
                  </label>
                  <label className="profile-field">
                    <span>Headline</span>
                    <input
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      name="headline"
                      placeholder="e.g. UI/UX Designer & Continuous Learner"
                      maxLength={120}
                    />
                  </label>
                  <label className="profile-field">
                    <span>Bio</span>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      name="bio"
                      rows={4}
                      placeholder="Tell others about your learning goals…"
                    />
                  </label>
                  <div className="profile-form-actions">
                    <button type="submit" className="profile-btn-save" disabled={saving}>
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </form>
              </section>
            </div>

            <aside className="profile-col profile-col-right">
              <section className="profile-card profile-enrollments">
                <div className="profile-enrollments-head">
                  <h2>My Enrollments</h2>
                  <Link to="/courses" className="profile-view-all">
                    View All
                  </Link>
                </div>
                <div className="profile-enroll-list">
                  {enrollments.length === 0 && (
                    <p className="profile-empty-enroll">You have not enrolled in any courses yet.</p>
                  )}
                  {enrollments.map((row) => {
                    const c = row.courseDetail || row.course;
                    const title = c?.title || "Course";
                    const total = row.lessonTotal ?? 0;
                    const done = row.lessonDone ?? 0;
                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                    return (
                      <article key={row._id} className="profile-enroll-card">
                        <div className="profile-enroll-thumb">
                          {c?.thumbnail ? (
                            <img src={c.thumbnail} alt="" />
                          ) : (
                            <span className="profile-enroll-thumb-ph">{initialsFromName(title)}</span>
                          )}
                        </div>
                        <div className="profile-enroll-body">
                          <span className="profile-enroll-label">Course</span>
                          <h3 className="profile-enroll-title">{title}</h3>
                          <p className="profile-enroll-meta">
                            {done} of {total} Lessons
                          </p>
                          <div className="profile-progress-row">
                            <span>Progress</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="profile-progress-bar">
                            <div className="profile-progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="profile-cta">
                <p>Ready for a new challenge?</p>
                <Link to="/courses" className="profile-btn-catalog">
                  Browse Catalog
                </Link>
              </section>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
