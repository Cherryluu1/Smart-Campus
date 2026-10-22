import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import api from "../services/api";

const DepartmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        hod: ""
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] =
        useState(editing);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editing) {
            loadDepartment();
        }
    }, [id]);

    const loadDepartment = async () => {
        try {
            const response =
                await api.get(`/departments/${id}`);

            const department = response.data;

            setFormData({
                name: department.name || "",
                code: department.code || "",
                description: department.description || "",
                hod: department.hod || ""
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load department."
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

        if (!formData.name || !formData.code) {
            setError(
                "Department name and code are required."
            );

            return;
        }

        try {
            setLoading(true);

            if (editing) {
                await api.put(
                    `/departments/${id}`,
                    formData
                );
            } else {
                await api.post(
                    "/departments",
                    formData
                );
            }

            navigate("/departments");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save department."
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading department...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        DEPARTMENT MANAGEMENT
                    </p>

                    <h1>
                        {editing
                            ? "Edit Department"
                            : "Add Department"}
                    </h1>

                    <p>
                        {editing
                            ? "Update department information."
                            : "Create a new department record."}
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
                            <h3>Department Details</h3>
                            <p>
                                Enter the department's
                                information.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Department Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Computer Science"
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
                                    Code *
                                </label>

                                <input
                                    type="text"
                                    name="code"
                                    placeholder="e.g. CSE"
                                    value={
                                        formData.code
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Description
                                </label>

                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Brief description of the department"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Head of Department (HoD)
                                </label>

                                <input
                                    type="text"
                                    name="hod"
                                    placeholder="e.g. Dr. Jane Smith"
                                    value={
                                        formData.hod
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
                                navigate("/departments")
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
                                ? "Update Department"
                                : "Create Department"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default DepartmentForm;
