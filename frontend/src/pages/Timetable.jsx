import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const DAY_ORDER = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const Timetable = () => {
    const [entries, setEntries] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { canEdit } = useRole();

    useEffect(() => {
        loadTimetable();
    }, []);

    const loadTimetable = async () => {
        try {
            setLoading(true);

            const response = await api.get("/timetable");

            setEntries(response.data);
            setError("");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load timetable."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteEntry = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this timetable entry?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/timetable/${id}`);

            setEntries((current) =>
                current.filter((entry) => entry._id !== id)
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete timetable entry."
            );
        }
    };

    const filteredEntries = entries
        .filter((entry) => {
            const text = search.toLowerCase();

            return (
                entry.day?.toLowerCase().includes(text) ||
                entry.room?.toLowerCase().includes(text) ||
                entry.section?.toLowerCase().includes(text) ||
                entry.subject?.name
                    ?.toLowerCase()
                    .includes(text) ||
                entry.faculty?.name
                    ?.toLowerCase()
                    .includes(text)
            );
        })
        .sort(
            (a, b) =>
                DAY_ORDER.indexOf(a.day) -
                DAY_ORDER.indexOf(b.day)
        );

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        CAMPUS MANAGEMENT
                    </p>

                    <h1>Timetable</h1>

                    <p>
                        Manage and view the class
                        schedule.
                    </p>
                </div>

                {canEdit ? (
                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/timetable/new")
                        }
                    >
                        + Add Timetable
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
                        <h3>Class Schedule</h3>

                        <p>
                            {entries.length} entr
                            {entries.length !== 1
                                ? "ies"
                                : "y"}
                        </p>
                    </div>

                    <div className="search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search timetable..."
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
                        <p>Loading timetable...</p>
                    </div>
                ) : filteredEntries.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ◷
                        </div>

                        <h3>
                            {search
                                ? "No entries found"
                                : "No timetable entries yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try another search term."
                                : "Add your first timetable entry to get started."}
                        </p>

                        {!search && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/timetable/new"
                                    )
                                }
                            >
                                Add Timetable
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Subject</th>
                                    <th>Faculty</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                    <th>Section</th>
                                    {canEdit && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredEntries.map(
                                    (entry) => (
                                        <tr
                                            key={
                                                entry._id
                                            }
                                        >
                                            <td>
                                                <div className="student-cell">
                                                    <div className="table-avatar">
                                                        {entry.day
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {
                                                            entry.day
                                                        }
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                <div>
                                                    <strong>
                                                        {entry
                                                            .subject
                                                            ?.name ||
                                                            "—"}
                                                    </strong>

                                                    {entry
                                                        .subject
                                                        ?.code && (
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "0.75rem",
                                                                opacity: 0.65,
                                                            }}
                                                        >
                                                            {
                                                                entry
                                                                    .subject
                                                                    .code
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                {entry
                                                    .faculty
                                                    ?.name ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {entry.startTime &&
                                                entry.endTime
                                                    ? `${entry.startTime} – ${entry.endTime}`
                                                    : "—"}
                                            </td>

                                            <td>
                                                {entry.room ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {entry.section ||
                                                    "—"}
                                            </td>

                                            {canEdit && (<td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/timetable/edit/${entry._id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteEntry(
                                                                entry._id
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

export default Timetable;
