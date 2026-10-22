import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { canEdit } = useRole();

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            setLoading(true);

            const response = await api.get("/departments");

            setDepartments(response.data);
            setError("");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load departments."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteDepartment = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this department?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/departments/${id}`);

            setDepartments((current) =>
                current.filter(
                    (department) => department._id !== id
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete department."
            );
        }
    };

    const filteredDepartments = departments.filter((department) => {
        const text = search.toLowerCase();

        return (
            department.name?.toLowerCase().includes(text) ||
            department.code?.toLowerCase().includes(text) ||
            department.hod?.toLowerCase().includes(text)
        );
    });

    return (
        <div className="page-container">
            <div className="page-heading students-heading">
                <div>
                    <p className="eyebrow">
                        CAMPUS MANAGEMENT
                    </p>

                    <h1>Departments</h1>

                    <p>
                        Manage and view all campus
                        departments.
                    </p>
                </div>

                {canEdit ? (
                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/departments/new")
                        }
                    >
                        + Add Department
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
                        <h3>Department Directory</h3>

                        <p>
                            {departments.length} department
                            {departments.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <div className="search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search departments..."
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
                        <p>Loading departments...</p>
                    </div>
                ) : filteredDepartments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ▦
                        </div>

                        <h3>
                            {search
                                ? "No departments found"
                                : "No departments yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try another search term."
                                : "Add your first department to get started."}
                        </p>

                        {!search && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/departments/new"
                                    )
                                }
                            >
                                Add Department
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Department Name</th>
                                    <th>Code</th>
                                    <th>Description</th>
                                    <th>HoD</th>
                                    {canEdit && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredDepartments.map(
                                    (department) => (
                                        <tr
                                            key={
                                                department._id
                                            }
                                        >
                                            <td>
                                                <div className="student-cell">
                                                    <div className="table-avatar">
                                                        {department.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {
                                                            department.name
                                                        }
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                {department.code ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {department.description ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {department.hod ||
                                                    "—"}
                                            </td>

                                            {canEdit && (<td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/departments/edit/${department._id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteDepartment(
                                                                department._id
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

export default Departments;
