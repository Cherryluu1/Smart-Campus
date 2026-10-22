import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { canEdit } = useRole();

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            setLoading(true);

            const response = await api.get("/exams");

            setExams(response.data);
            setError("");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load exams."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteExam = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this exam?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/exams/${id}`);

            setExams((current) =>
                current.filter(
                    (exam) => exam._id !== id
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete exam."
            );
        }
    };

    const filteredExams = exams.filter((exam) => {
        const text = search.toLowerCase();

        return (
            exam.title?.toLowerCase().includes(text) ||
            exam.type?.toLowerCase().includes(text) ||
            exam.venue?.toLowerCase().includes(text) ||
            exam.subject?.name
                ?.toLowerCase()
                .includes(text)
        );
    });

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        CAMPUS MANAGEMENT
                    </p>

                    <h1>Exams</h1>

                    <p>
                        Manage and view all scheduled
                        exams.
                    </p>
                </div>

                {canEdit ? (
                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/exams/new")
                        }
                    >
                        + Add Exam
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
                        <h3>Exam Directory</h3>

                        <p>
                            {exams.length} exam
                            {exams.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <div className="search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search exams..."
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
                        <p>Loading exams...</p>
                    </div>
                ) : filteredExams.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ✎
                        </div>

                        <h3>
                            {search
                                ? "No exams found"
                                : "No exams yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try another search term."
                                : "Add your first exam to get started."}
                        </p>

                        {!search && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/exams/new"
                                    )
                                }
                            >
                                Add Exam
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
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Venue</th>
                                    <th>Total Marks</th>
                                    {canEdit && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredExams.map(
                                    (exam) => (
                                        <tr
                                            key={
                                                exam._id
                                            }
                                        >
                                            <td>
                                                <div className="student-cell">
                                                    <div className="table-avatar">
                                                        {exam.title
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {
                                                            exam.title
                                                        }
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                {exam.type ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {exam
                                                    .subject
                                                    ?.name ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {exam.date
                                                    ? new Date(
                                                          exam.date
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            <td>
                                                {exam.time ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {exam.venue ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {exam.totalMarks ??
                                                    "—"}
                                            </td>

                                            {canEdit && (<td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/exams/edit/${exam._id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteExam(
                                                                exam._id
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

export default Exams;
