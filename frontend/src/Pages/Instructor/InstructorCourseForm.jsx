import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import * as api from "../../api/instructorApi";

const empty = {
  title: "",
  description: "",
  price: "",
  category: "",
  level: "beginner",
  isPublished: false,
};

export default function InstructorCourseForm() {
  const { courseId } = useParams();
  const isEdit = Boolean(courseId);
  const navigate = useNavigate();
  const { pushToast } = useOutletContext();

  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.getCourse(courseId);
        const c = data.course || data;
        if (cancelled) return;
        setForm({
          title: c.title || "",
          description: c.description || "",
          price: String(c.price ?? ""),
          category: c.category || "",
          level: c.level || "beginner",
          isPublished: Boolean(c.isPublished),
        });
        if (c.thumbnail) setPreview(c.thumbnail);
      } catch (e) {
        pushToast(e.response?.data?.message || "Could not load course", "err");
        navigate("/dashboard/courses");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, isEdit, navigate, pushToast]);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        if (file) {
          const fd = new FormData();
          fd.append("title", form.title);
          fd.append("description", form.description);
          fd.append("price", form.price);
          fd.append("category", form.category);
          fd.append("level", form.level);
          fd.append("isPublished", String(form.isPublished));
          fd.append("image", file);
          await api.updateCourse(courseId, fd);
        } else {
          await api.updateCourse(courseId, {
            title: form.title,
            description: form.description,
            price: Number(form.price),
            category: form.category,
            level: form.level,
            isPublished: form.isPublished,
          });
        }
        pushToast("Course updated");
      } else {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("price", form.price);
        fd.append("category", form.category);
        fd.append("level", form.level);
        fd.append("isPublished", String(form.isPublished));
        if (file) fd.append("image", file);
        await api.createCourse(fd);
        pushToast("Course created");
      }
      navigate("/dashboard/courses");
    } catch (e) {
      const msg =
        e.response?.data?.errors?.map((x) => x.msg).join(" ") ||
        e.response?.data?.message ||
        "Save failed";
      pushToast(msg, "err");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="inst-skeleton" style={{ height: 320, maxWidth: 640 }} />;
  }

  return (
    <div className="inst-panel" style={{ maxWidth: 720 }}>
      <h2 className="inst-panel-title" style={{ marginBottom: 20 }}>
        {isEdit ? "Edit course" : "Create course"}
      </h2>
      <form className="inst-form-grid" onSubmit={submit}>
        <div className="inst-field">
          <label>Title</label>
          <input
            className="inst-input"
            required
            minLength={5}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="inst-field">
          <label>Description</label>
          <textarea
            className="inst-textarea"
            required
            minLength={20}
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="inst-field" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label>Price (USD)</label>
            <input
              className="inst-input"
              type="number"
              min={0}
              step={0.01}
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label>Category</label>
            <input
              className="inst-input"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
        </div>
        <div className="inst-field" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label>Level</label>
            <select
              className="inst-select"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              />
              Published
            </label>
          </div>
        </div>
        <div className="inst-field">
          <label>Thumbnail {!isEdit && "(optional)"}</label>
          <input type="file" accept="image/*" onChange={onFile} />
          {preview && <img className="inst-preview-img" src={preview} alt="" />}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" className="inst-btn-primary" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Update course" : "Create course"}
          </button>
          <button
            type="button"
            className="inst-btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
