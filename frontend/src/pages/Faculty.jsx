import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const Faculty = () => {
    const [faculty, setFaculty] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { canEdit } = useRole();

    useEffect(() => {
        loadFaculty();
    }, []);

    const loadFaculty = async () => {
        try {
            setLoading(true);

            const response = await api.get("/faculty");

            setFaculty(response.data);
            setError("");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load faculty."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteFaculty = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this faculty member?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/faculty/${id}`);

            setFaculty((current) =>
                current.filter(
                    (member) => member._id !== id
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete faculty member."
            );
        }
    };

    const filteredFaculty = faculty.filter((member) => {
        const text = search.toLowerCase();

        return (
            member.name?.toLowerCase().includes(text) ||
            member.email?.toLowerCase().includes(text) ||
            member.facultyId?.toLowerCase().includes(text) ||
            member.designation?.toLowerCase().includes(text) ||
            member.department?.name
                ?.toLowerCase()
                .includes(text)
        );
    });

    return (
        <div className="page-container">
            <div className="page-heading faculty-heading">
                <div>
                    <p className="eyebrow">
                        CAMPUS MANAGEMENT
                    </p>

                    <h1>Faculty</h1>

                    <p>
                        Manage and view all registered
                        faculty members.
                    </p>
                </div>

                {canEdit ? (
                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/faculty/new")
                        }
                    >
                        + Add Faculty
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
                        <h3>Faculty Directory</h3>

                        <p>
                            {faculty.length} faculty
                            {faculty.length !== 1
                                ? " members"
                                : " member"}
                        </p>
                    </div>

                    <div className="search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search faculty..."
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
                        <p>Loading faculty...</p>
                    </div>
                ) : filteredFaculty.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ◉
                        </div>

                        <h3>
                            {search
                                ? "No faculty found"
                                : "No faculty yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try another search term."
                                : "Add your first faculty member to get started."}
                        </p>

                        {!search && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/faculty/new"
                                    )
                                }
                            >
                                Add Faculty
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Faculty ID</th>
                                    <th>Email</th>
                                    <th>Designation</th>
                                    <th>Department</th>
                                    {canEdit && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredFaculty.map(
                                    (member) => (
                                        <tr
                                            key={
                                                member._id
                                            }
                                        >
                                            <td>
                                                <div className="student-cell">
                                                    <div className="table-avatar">
                                                        {member.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {
                                                            member.name
                                                        }
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                {
                                                    member.facultyId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    member.email
                                                }
                                            </td>

                                            <td>
                                                {member.designation ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {member
                                                    .department
                                                    ?.name ||
                                                    "—"}
                                            </td>

                                            {canEdit && (<td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/faculty/edit/${member._id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteFaculty(
                                                                member._id
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

export default Faculty;
