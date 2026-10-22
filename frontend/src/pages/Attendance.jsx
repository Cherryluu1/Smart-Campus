import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const Attendance = () => {
    const [records, setRecords] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { canEdit } = useRole();

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = async () => {
        try {
            setLoading(true);

            const response = await api.get("/attendance");

            setRecords(response.data);
            setError("");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load attendance records."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteRecord = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this attendance record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/attendance/${id}`);

            setRecords((current) =>
                current.filter((record) => record._id !== id)
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete attendance record."
            );
        }
    };

    const getStatusClass = (status) => {
        if (!status) return "";
        const normalized = status.toLowerCase();
        if (normalized === "present") return "status-present";
        if (normalized === "absent") return "status-absent";
        if (normalized === "leave") return "status-leave";
        return "";
    };

    const filteredRecords = records.filter((record) => {
        const text = search.toLowerCase();

        return (
            record.student?.name?.toLowerCase().includes(text) ||
            record.student?.studentId?.toLowerCase().includes(text) ||
            record.subject?.name?.toLowerCase().includes(text) ||
            record.status?.toLowerCase().includes(text)
        );
    });

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        CAMPUS MANAGEMENT
                    </p>

                    <h1>Attendance</h1>

                    <p>
                        Manage and view all attendance
                        records.
                    </p>
                </div>

                {canEdit ? (
                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/attendance/new")
                        }
                    >
                        + Add Attendance
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
                        <h3>Attendance Records</h3>

                        <p>
                            {records.length} record
                            {records.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <div className="search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search attendance..."
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
                        <p>Loading attendance records...</p>
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ✓
                        </div>

                        <h3>
                            {search
                                ? "No records found"
                                : "No attendance records yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try another search term."
                                : "Add your first attendance record to get started."}
                        </p>

                        {!search && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/attendance/new"
                                    )
                                }
                            >
                                Add Attendance
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Student ID</th>
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    {canEdit && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRecords.map(
                                    (record) => (
                                        <tr
                                            key={
                                                record._id
                                            }
                                        >
                                            <td>
                                                <div className="student-cell">
                                                    <div className="table-avatar">
                                                        {record.student?.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {
                                                            record
                                                                .student
                                                                ?.name
                                                        }
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                {record
                                                    .student
                                                    ?.studentId ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {record
                                                    .subject
                                                    ?.name ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {record.date
                                                    ? new Date(
                                                          record.date
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            <td>
                                                <span
                                                    className={getStatusClass(
                                                        record.status
                                                    )}
                                                >
                                                    {
                                                        record.status
                                                    }
                                                </span>
                                            </td>

                                            {canEdit && (<td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/attendance/edit/${record._id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteRecord(
                                                                record._id
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

export default Attendance;
