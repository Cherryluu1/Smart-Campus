import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { canEdit } = useRole();

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            setLoading(true);

            const response = await api.get("/subjects");

            setSubjects(response.data);
            setError("");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load subjects."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteSubject = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this subject?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/subjects/${id}`);

            setSubjects((current) =>
                current.filter(
                    (subject) => subject._id !== id
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete subject."
            );
        }
    };

    const filteredSubjects = subjects.filter((subject) => {
        const text = search.toLowerCase();

        return (
            subject.name?.toLowerCase().includes(text) ||
            subject.code?.toLowerCase().includes(text) ||
            subject.department?.name
                ?.toLowerCase()
                .includes(text) ||
            subject.faculty?.name
                ?.toLowerCase()
                .includes(text)
        );
    });

    return (
        <div className="page-container">
            <div className="page-heading students-heading">
                <div>
                    <p className="eyebrow">
                        CAMPUS MANAGEMENT
                    </p>

                    <h1>Subjects</h1>

                    <p>
                        Manage and view all campus
                        subjects.
                    </p>
                </div>

                {canEdit ? (
                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/subjects/new")
                        }
                    >
                        + Add Subject
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
                        <h3>Subject Directory</h3>

                        <p>
                            {subjects.length} subject
                            {subjects.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <div className="search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search subjects..."
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
                        <p>Loading subjects...</p>
                    </div>
                ) : filteredSubjects.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ▤
                        </div>

                        <h3>
                            {search
                                ? "No subjects found"
                                : "No subjects yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try another search term."
                                : "Add your first subject to get started."}
                        </p>

                        {!search && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/subjects/new"
                                    )
                                }
                            >
                                Add Subject
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Code</th>
                                    <th>Credits</th>
                                    <th>Semester</th>
                                    <th>Department</th>
                                    <th>Faculty</th>
                                    {canEdit && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredSubjects.map(
                                    (subject) => (
                                        <tr
                                            key={
                                                subject._id
                                            }
                                        >
                                            <td>
                                                <div className="student-cell">
                                                    <div className="table-avatar">
                                                        {subject.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {
                                                            subject.name
                                                        }
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                {
                                                    subject.code
                                                }
                                            </td>

                                            <td>
                                                {subject.credits ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {subject.semester
                                                    ? `Semester ${subject.semester}`
                                                    : "—"}
                                            </td>

                                            <td>
                                                {subject
                                                    .department
                                                    ?.name ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {subject
                                                    .faculty
                                                    ?.name ||
                                                    "—"}
                                            </td>

                                            {canEdit && (<td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/subjects/edit/${subject._id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteSubject(
                                                                subject._id
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

export default Subjects;
