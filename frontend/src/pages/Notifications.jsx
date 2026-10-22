import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { canEdit } = useRole();

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);

            const response = await api.get("/notifications");

            setNotifications(response.data);
            setError("");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load notifications."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this notification?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/notifications/${id}`);

            setNotifications((current) =>
                current.filter(
                    (notification) => notification._id !== id
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete notification."
            );
        }
    };

    const filteredNotifications = notifications.filter(
        (notification) => {
            const text = search.toLowerCase();

            return (
                notification.title
                    ?.toLowerCase()
                    .includes(text) ||
                notification.type
                    ?.toLowerCase()
                    .includes(text) ||
                notification.targetRole
                    ?.toLowerCase()
                    .includes(text) ||
                notification.message
                    ?.toLowerCase()
                    .includes(text)
            );
        }
    );

    const truncate = (text, limit = 60) => {
        if (!text) return "—";
        return text.length > limit
            ? text.slice(0, limit) + "..."
            : text;
    };

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        CAMPUS MANAGEMENT
                    </p>

                    <h1>Notifications</h1>

                    <p>
                        Manage and view all campus
                        notifications.
                    </p>
                </div>

                {canEdit ? (
                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/notifications/new")
                        }
                    >
                        + Add Notification
                    </button>
                ) : (
                    <span className="view-only-badge">
                        ?? VIEW ONLY
                    </span>
                )}
            </div>

            <section className="content-card">
                <div className="table-toolbar">
                    <div>
                        <h3>Notification Directory</h3>

                        <p>
                            {notifications.length}{" "}
                            notification
                            {notifications.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <div className="search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading notifications...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            !
                        </div>

                        <h3>
                            {search
                                ? "No notifications found"
                                : "No notifications yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try another search term."
                                : "Add your first notification to get started."}
                        </p>

                        {!search && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/notifications/new"
                                    )
                                }
                            >
                                Add Notification
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Target</th>
                                    <th>Message</th>
                                    <th>Read</th>
                                    <th>Date</th>
                                    {canEdit && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredNotifications.map(
                                    (notification) => (
                                        <tr
                                            key={
                                                notification._id
                                            }
                                        >
                                            <td>
                                                <div className="student-cell">
                                                    <div className="table-avatar">
                                                        {notification.title
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {
                                                            notification.title
                                                        }
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                {notification.type ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {notification.targetRole ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {truncate(
                                                    notification.message
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    style={{
                                                        padding:
                                                            "2px 10px",
                                                        borderRadius:
                                                            "12px",
                                                        fontSize:
                                                            "0.78rem",
                                                        fontWeight:
                                                            "600",
                                                        background:
                                                            notification.isRead
                                                                ? "#d1fae5"
                                                                : "#fee2e2",
                                                        color: notification.isRead
                                                            ? "#065f46"
                                                            : "#991b1b"
                                                    }}
                                                >
                                                    {notification.isRead
                                                        ? "Yes"
                                                        : "No"}
                                                </span>
                                            </td>

                                            <td>
                                                {notification.createdAt
                                                    ? new Date(
                                                          notification.createdAt
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            {canEdit && (<td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/notifications/edit/${notification._id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteNotification(
                                                                notification._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>)}
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Notifications;
