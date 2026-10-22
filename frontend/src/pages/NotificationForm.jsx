import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import api from "../services/api";

const NotificationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = Boolean(id);

    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "General",
        targetRole: "All",
        isRead: "false"
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] =
        useState(editing);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editing) {
            loadNotification();
        }
    }, [id]);

    const loadNotification = async () => {
        try {
            const response = await api.get(
                `/notifications/${id}`
            );

            const notification = response.data;

            setFormData({
                title: notification.title || "",
                message: notification.message || "",
                type: notification.type || "General",
                targetRole:
                    notification.targetRole || "All",
                isRead: notification.isRead
                    ? "true"
                    : "false"
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load notification."
            );
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.title || !formData.message) {
            setError(
                "Title and message are required."
            );

            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                isRead: formData.isRead === "true"
            };

            if (editing) {
                await api.put(
                    `/notifications/${id}`,
                    payload
                );
            } else {
                await api.post(
                    "/notifications",
                    payload
                );
            }

            navigate("/notifications");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save notification."
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading notification...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        NOTIFICATION MANAGEMENT
                    </p>

                    <h1>
                        {editing
                            ? "Edit Notification"
                            : "Add Notification"}
                    </h1>

                    <p>
                        {editing
                            ? "Update notification details."
                            : "Create a new campus notification."}
                    </p>
                </div>
            </div>

            <section className="content-card form-card">
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="form-section-title">
                            <h3>
                                Notification Details
                            </h3>
                            <p>
                                Enter the notification
                                information below.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Title *
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter notification title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Type
                                </label>

                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="General">
                                        General
                                    </option>

                                    <option value="Academic">
                                        Academic
                                    </option>

                                    <option value="Exam">
                                        Exam
                                    </option>

                                    <option value="Event">
                                        Event
                                    </option>

                                    <option value="Placement">
                                        Placement
                                    </option>

                                    <option value="Important">
                                        Important
                                    </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    Target Role
                                </label>

                                <select
                                    name="targetRole"
                                    value={
                                        formData.targetRole
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="All">
                                        All
                                    </option>

                                    <option value="Students">
                                        Students
                                    </option>

                                    <option value="Faculty">
                                        Faculty
                                    </option>

                                    <option value="Admin">
                                        Admin
                                    </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    Read Status
                                </label>

                                <select
                                    name="isRead"
                                    value={
                                        formData.isRead
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="false">
                                        Unread
                                    </option>

                                    <option value="true">
                                        Read
                                    </option>
                                </select>
                            </div>

                            <div
                                className="form-group"
                                style={{
                                    gridColumn:
                                        "1 / -1"
                                }}
                            >
                                <label>
                                    Message *
                                </label>

                                <textarea
                                    name="message"
                                    placeholder="Enter notification message"
                                    rows={5}
                                    value={
                                        formData.message
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    "/notifications"
                                )
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : editing
                                ? "Update Notification"
                                : "Create Notification"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default NotificationForm;
