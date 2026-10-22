import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { canEdit } = useRole();

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            setLoading(true);

            const response = await api.get("/assignments");

            setAssignments(response.data);
            setError("");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load assignments."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteAssignment = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this assignment?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/assignments/${id}`);

            setAssignments((current) =>
                current.filter(
                    (assignment) => assignment._id !== id
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete assignment."
            );
        }
    };

    const filteredAssignments = assignments.filter((assignment) => {
        const text = search.toLowerCase();

        return (
            assignment.title?.toLowerCase().includes(text) ||
            assignment.subject?.name
                ?.toLowerCase()
                .includes(text) ||
            assignment.faculty?.name
                ?.toLowerCase()
                .includes(text)
        );
    });

    return (
        <div className="page-container">
            <div className="page-heading assignments-heading">
                <div>
                    <p className="eyebrow">
                        CAMPUS MANAGEMENT
                    </p>

                    <h1>Assignments</h1>

                    <p>
                        Manage and view all campus
                        assignments.
                    </p>
                </div>

                {canEdit ? (
                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/assignments/new")
                        }
                    >
                        + Add Assignment
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
                        <h3>Assignment Directory</h3>

                        <p>
                            {assignments.length} assignment
                            {assignments.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <div className="search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search assignments..."
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
                        <p>Loading assignments...</p>
                    </div>
                ) : filteredAssignments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ▣
                        </div>

                        <h3>
                            {search
                                ? "No assignments found"
                                : "No assignments yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try another search term."
                                : "Add your first assignment to get started."}
                        </p>

                        {!search && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/assignments/new"
                                    )
                                }
                            >
                                Add Assignment
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Subject</th>
                                    <th>Faculty</th>
                                    <th>Due Date</th>
                                    <th>Max Marks</th>
                                    {canEdit && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredAssignments.map(
                                    (assignment) => (
                                        <tr
                                            key={
                                                assignment._id
                                            }
                                        >
                                            <td>
                                                <div className="student-cell">
                                                    <div className="table-avatar">
                                                        {assignment.title
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {
                                                            assignment.title
                                                        }
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                {assignment
                                                    .subject
                                                    ?.name ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {assignment
                                                    .faculty
                                                    ?.name ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {assignment.dueDate
                                                    ? new Date(
                                                          assignment.dueDate
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            <td>
                                                {assignment.maxMarks ??
                                                    "—"}
                                            </td>

                                            {canEdit && (<td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/assignments/edit/${assignment._id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteAssignment(
                                                                assignment._id
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

export default Assignments;
