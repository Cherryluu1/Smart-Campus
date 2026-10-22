import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const MATERIAL_TYPES = ["Notes", "PDF", "Video", "Link", "Other"];

const MaterialForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    url: "",
    subject: "",
    faculty: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [subRes, facRes] = await Promise.all([
          api.get("/subjects"),
          api.get("/faculty"),
        ]);
        setSubjects(subRes.data);
        setFaculties(facRes.data);
      } catch {
        setError("Failed to load dropdown data.");
      }
    };

    const loadMaterial = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/materials/${id}`);
        const m = res.data;
        setForm({
          title: m.title || "",
          description: m.description || "",
          type: m.type || "",
          url: m.url || "",
          subject: m.subject?._id || m.subject || "",
          faculty: m.faculty?._id || m.faculty || "",
        });
      } catch {
        setError("Failed to load material.");
      } finally {
        setLoading(false);
      }
    };

    loadDropdowns();
    if (isEdit) loadMaterial();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        type: form.type || undefined,
        subject: form.subject || undefined,
        faculty: form.faculty || undefined,
      };
      if (isEdit) {
        await api.put(`/materials/${id}`, payload);
      } else {
        await api.post("/materials", payload);
      }
      navigate("/materials");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save material. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MATERIAL MANAGEMENT</p>
          <h1>{isEdit ? "Edit Material" : "Add Material"}</h1>
        </div>
      </div>

      <div className="form-card">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Section 1: Material Details */}
          <div className="form-section">
            <h2 className="form-section-title">Material Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Title <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter material title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="">— Select Type —</option>
                  {MATERIAL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>URL</label>
                <input
                  type="text"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="https://example.com/resource"
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter a brief description"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Assignment */}
          <div className="form-section">
            <h2 className="form-section-title">Assignment</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange}>
                  <option value="">— Select Subject —</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Faculty</label>
                <select name="faculty" value={form.faculty} onChange={handleChange}>
                  <option value="">— Select Faculty —</option>
                  {faculties.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/materials")}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Update Material" : "Add Material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialForm;
