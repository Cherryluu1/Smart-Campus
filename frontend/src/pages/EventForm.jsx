import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    organizer: "",
    category: "General",
    status: "Upcoming",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetchEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      const event = res.data;
      setForm({
        title: event.title || "",
        description: event.description || "",
        date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
        venue: event.venue || "",
        organizer: event.organizer || "",
        category: event.category || "General",
        status: event.status || "Upcoming",
      });
      setError(null);
    } catch (err) {
      setError("Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/events/${id}`, form);
      } else {
        await api.post("/events", form);
      }
      navigate("/events");
    } catch (err) {
      setError("Failed to save event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">EVENT MANAGEMENT</p>
          <h1>{isEdit ? "Edit Event" : "Add Event"}</h1>
        </div>
      </div>

      {loading && !isEdit ? (
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      ) : (
        <form className="form-card" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          {/* Section 1: Event Details */}
          <div className="form-section">
            <h2 className="form-section-title">Event Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Title <span>*</span></label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Event title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. General, Academic, Sports"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="description">Description <span>*</span></label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe the event..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Event Info */}
          <div className="form-section">
            <h2 className="form-section-title">Event Info</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="date">Date <span>*</span></label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="venue">Venue <span>*</span></label>
                <input
                  id="venue"
                  name="venue"
                  type="text"
                  value={form.venue}
                  onChange={handleChange}
                  required
                  placeholder="Event venue"
                />
              </div>

              <div className="form-group">
                <label htmlFor="organizer">Organizer <span>*</span></label>
                <input
                  id="organizer"
                  name="organizer"
                  type="text"
                  value={form.organizer}
                  onChange={handleChange}
                  required
                  placeholder="Organizer name"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/events")}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Event" : "Add Event"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EventForm;
