import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const Results = () => {
    const [results, setResults] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { canEdit } = useRole();

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            setLoading(true);

            const response = await api.get("/results");

            setResults(response.data);
            setError("");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load results."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteResult = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this result?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/results/${id}`);

            setResults((current) =>
                current.filter(
                    (result) => result._id !== id
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete result."
            );
        }
    };

    const filteredResults = results.filter((result) => {
        const text = search.toLowerCase();

        return (
            result.student?.name
                ?.toLowerCase()
                .includes(text) ||
            result.student?.studentId
                ?.toLowerCase()
                .includes(text) ||
            result.subject?.name
                ?.toLowerCase()
                .includes(text) ||
            result.grade?.toLowerCase().includes(text)
        );
    });

    return (
        <div className="page-container">
            <div className="page-heading results-heading">
                <div>
                    <p className="eyebrow">
                        CAMPUS MANAGEMENT
                    </p>

                    <h1>Results</h1>

                    <p>
                        Manage and view all student
                        results.
                    </p>
                </div>

                {canEdit ? (
                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/results/new")
                        }
                    >
                        + Add Result
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
                        <h3>Result Records</h3>

                        <p>
                            {results.length} result
                            {results.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <div className="search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search results..."
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
                        <p>Loading results...</p>
                    </div>
                ) : filteredResults.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ★
                        </div>

                        <h3>
                            {search
                                ? "No results found"
                                : "No results yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try another search term."
                                : "Add your first result to get started."}
                        </p>

                        {!search && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/results/new"
                                    )
                                }
                            >
                                Add Result
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
                                    <th>Exam</th>
                                    <th>Marks</th>
                                    <th>Grade</th>
                                    <th>Semester</th>
                                    {canEdit && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredResults.map(
                                    (result) => (
                                        <tr
                                            key={
                                                result._id
                                            }
                                        >
                                            <td>
                                                <div className="student-cell">
                                                    <div className="table-avatar">
                                                        {result.student?.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {
                                                            result
                                                                .student
                                                                ?.name
                                                        }
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                {result
                                                    .student
                                                    ?.studentId ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {result
                                                    .subject
                                                    ?.name ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {result
                                                    .exam
                                                    ?.title ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {result.marks}
                                                /
                                                {result.maxMarks}
                                            </td>

                                            <td>
                                                {result.grade ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {result.semester ||
                                                    "—"}
                                            </td>

                                            {canEdit && (<td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/results/edit/${result._id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteResult(
                                                                result._id
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

export default Results;
