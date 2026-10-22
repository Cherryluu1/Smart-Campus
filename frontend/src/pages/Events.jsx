import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const Events = () => {
  const navigate = useNavigate();
    const { canEdit } = useRole();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events");
      setEvents(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert("Failed to delete event.");
    }
  };

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.title?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q) ||
      e.organizer?.toLowerCase().includes(q) ||
      e.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CAMPUS MANAGEMENT</p>
          <h1>Events</h1>
        </div>
        {canEdit ? (
          <button className="primary-button" onClick={() => navigate("/events/new")}>
            + Add Event
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
            placeholder="Search by title, category, venue, organizer, status..."
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
            <div className="empty-icon">◆</div>
            <p>No events found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Organizer</th>
                  <th>Status</th>
                  {canEdit && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr key={event._id}>
                    <td>
                      <div className="student-cell">
                        <div className="table-avatar">
                          {event.title?.charAt(0).toUpperCase()}
                        </div>
                        <span>{event.title}</span>
                      </div>
                    </td>
                    <td>{event.category}</td>
                    <td>
                      {event.date
                        ? new Date(event.date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>{event.venue}</td>
                    <td>{event.organizer}</td>
                    <td>
                      <span className={`badge badge-${event.status?.toLowerCase()}`}>
                        {event.status}
                      </span>
                    </td>
                    {canEdit && (<td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => navigate(`/events/edit/${event._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(event._id)}
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

export default Events;
