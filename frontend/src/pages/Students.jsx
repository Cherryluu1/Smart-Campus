import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const Students = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { canEdit } = useRole();


    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);

            const response = await api.get("/students");

            setStudents(response.data);
            setError("");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load students."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteStudent = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/students/${id}`);

            setStudents((current) =>
                current.filter(
                    (student) => student._id !== id
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete student."
            );
        }
    };

    const filteredStudents = students.filter((student) => {
        const text = search.toLowerCase();

        return (
            student.name?.toLowerCase().includes(text) ||
            student.email?.toLowerCase().includes(text) ||
            student.studentId?.toLowerCase().includes(text) ||
            student.department?.name
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

                    <h1>Students</h1>

                    <p>
                        Manage and view all registered
                        students.
                    </p>
                </div>

                {canEdit ? (
                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/students/new")
                        }
                    >
                        + Add Student
                    </button>
                ) : (
                    <span className="view-only-badge">
                        👁 VIEW ONLY
                    </span>
                )}
            </div>


            <section className="content-card">
                <div className="table-toolbar">
                    <div>
                        <h3>Student Directory</h3>

                        <p>
                            {students.length} student
                            {students.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <div className="search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search students..."
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
                        <p>Loading students...</p>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ♙
                        </div>

                        <h3>
                            {search
                                ? "No students found"
                                : "No students yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try another search term."
                                : "Add your first student to get started."}
                        </p>

                        {!search && canEdit && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/students/new"
                                    )
                                }
                            >
                                Add Student
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
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Year</th>
                                    <th>Section</th>
                                    {canEdit && <th>Actions</th>}
                                </tr>
                            </thead>


                            <tbody>
                                {filteredStudents.map(
                                    (student) => (
                                        <tr
                                            key={
                                                student._id
                                            }
                                        >
                                            <td>
                                                <div className="student-cell">
                                                    <div className="table-avatar">
                                                        {student.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {
                                                            student.name
                                                        }
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                {
                                                    student.studentId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    student.email
                                                }
                                            </td>

                                            <td>
                                                {student
                                                    .department
                                                    ?.name ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {student.year ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {student.section ||
                                                    "—"}
                                            </td>

                                                {canEdit && (
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="edit-button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/students/edit/${student._id}`
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                className="delete-button"
                                                                onClick={() =>
                                                                    deleteStudent(
                                                                        student._id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
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

export default Students;