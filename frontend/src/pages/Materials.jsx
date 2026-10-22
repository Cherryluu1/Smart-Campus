import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const Materials = () => {
  const navigate = useNavigate();
    const { canEdit } = useRole();
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/materials");
      setMaterials(res.data);
    } catch (err) {
      setError("Failed to load materials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      await api.delete(`/materials/${id}`);
      setMaterials((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert("Failed to delete material.");
    }
  };

  const filtered = materials.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.title?.toLowerCase().includes(q) ||
      m.type?.toLowerCase().includes(q) ||
      m.subject?.name?.toLowerCase().includes(q) ||
      m.faculty?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CAMPUS MANAGEMENT</p>
          <h1>Materials</h1>
        </div>
        {canEdit ? (
          <button className="primary-button" onClick={() => navigate("/materials/new")}>
            + Add Material
          </button>
        ) : (
          <span className="view-only-badge">👁 VIEW ONLY</span>
        )}
      </div>

      <div className="content-card">
        <div className="table-toolbar">
          <input
            className="search-box"
            type="text"
            placeholder="Search by title, type, subject or faculty…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▤</div>
            <p>No materials found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Subject</th>
                  <th>Faculty</th>
                  <th>URL</th>
                  {canEdit && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <div className="student-cell">
                        <div className="table-avatar">
                          {m.title?.charAt(0).toUpperCase() || "M"}
                        </div>
                        <span>{m.title}</span>
                      </div>
                    </td>
                    <td>{m.type || "—"}</td>
                    <td>{m.subject?.name || "—"}</td>
                    <td>{m.faculty?.name || "—"}</td>
                    <td>
                      {m.url ? (
                        <a href={m.url} target="_blank" rel="noopener noreferrer">
                          {m.url.length > 30 ? m.url.slice(0, 30) + "…" : m.url}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    {canEdit && (<td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => navigate(`/materials/edit/${m._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(m._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;
