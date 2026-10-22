import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import api from "../services/api";

const FacultyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = Boolean(id);

    const [departments, setDepartments] = useState([]);

    const [formData, setFormData] = useState({
        facultyId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: ""
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] =
        useState(editing);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDepartments();

        if (editing) {
            loadFacultyMember();
        }
    }, [id]);

    const loadDepartments = async () => {
        try {
            const response =
                await api.get("/departments");

            setDepartments(response.data);
        } catch (error) {
            console.error(
                "Department loading error:",
                error
            );
        }
    };

    const loadFacultyMember = async () => {
        try {
            const response =
                await api.get(`/faculty/${id}`);

            const member = response.data;

            setFormData({
                facultyId: member.facultyId || "",
                name: member.name || "",
                email: member.email || "",
                phone: member.phone || "",
                department:
                    member.department?._id ||
                    member.department ||
                    "",
                designation: member.designation || ""
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load faculty member."
            );
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !formData.facultyId ||
            !formData.name ||
            !formData.email
        ) {
            setError(
                "Faculty ID, name and email are required."
            );

            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                department:
                    formData.department || undefined
            };

            if (editing) {
                await api.put(
                    `/faculty/${id}`,
                    payload
                );
            } else {
                await api.post(
                    "/faculty",
                    payload
                );
            }

            navigate("/faculty");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save faculty member."
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading faculty member...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        FACULTY MANAGEMENT
                    </p>

                    <h1>
                        {editing
                            ? "Edit Faculty"
                            : "Add Faculty"}
                    </h1>

                    <p>
                        {editing
                            ? "Update faculty member information."
                            : "Create a new faculty member record."}
                    </p>
                </div>
            </div>

            <section className="content-card form-card">
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="form-section-title">
                            <h3>Basic Information</h3>
                            <p>
                                Enter the faculty
                                member's basic details.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Faculty ID *
                                </label>

                                <input
                                    type="text"
                                    name="facultyId"
                                    placeholder="e.g. FAC2026001"
                                    value={
                                        formData.facultyId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Full Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter full name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Email *
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="faculty@example.com"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">
                            <h3>Department &amp; Role</h3>
                            <p>
                                Assign department and
                                designation details.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Department
                                </label>

                                <select
                                    name="department"
                                    value={
                                        formData.department
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select Department
                                    </option>

                                    {departments.map(
                                        (
                                            department
                                        ) => (
                                            <option
                                                key={
                                                    department._id
                                                }
                                                value={
                                                    department._id
                                                }
                                            >
                                                {
                                                    department.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    Designation
                                </label>

                                <input
                                    type="text"
                                    name="designation"
                                    placeholder="e.g. Assistant Professor"
                                    value={
                                        formData.designation
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate("/faculty")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : editing
                                ? "Update Faculty"
                                : "Create Faculty"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default FacultyForm;
