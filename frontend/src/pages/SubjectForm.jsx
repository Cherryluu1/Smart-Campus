import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import api from "../services/api";

const SubjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = Boolean(id);

    const [departments, setDepartments] = useState([]);
    const [faculty, setFaculty] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        credits: 3,
        semester: "",
        department: "",
        faculty: ""
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] =
        useState(editing);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDropdowns();

        if (editing) {
            loadSubject();
        }
    }, [id]);

    const loadDropdowns = async () => {
        try {
            const [deptRes, facultyRes] =
                await Promise.all([
                    api.get("/departments"),
                    api.get("/faculty")
                ]);

            setDepartments(deptRes.data);
            setFaculty(facultyRes.data);
        } catch (error) {
            console.error(
                "Dropdown loading error:",
                error
            );
        }
    };

    const loadSubject = async () => {
        try {
            const response =
                await api.get(`/subjects/${id}`);

            const subject = response.data;

            setFormData({
                name: subject.name || "",
                code: subject.code || "",
                credits:
                    subject.credits !== undefined
                        ? subject.credits
                        : 3,
                semester: subject.semester || "",
                department:
                    subject.department?._id ||
                    subject.department ||
                    "",
                faculty:
                    subject.faculty?._id ||
                    subject.faculty ||
                    ""
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load subject."
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
                "Subject name and code are required."
            );

            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                credits: formData.credits
                    ? Number(formData.credits)
                    : undefined,
                semester: formData.semester
                    ? Number(formData.semester)
                    : undefined,
                department:
                    formData.department || undefined,
                faculty:
                    formData.faculty || undefined
            };

            if (editing) {
                await api.put(
                    `/subjects/${id}`,
                    payload
                );
            } else {
                await api.post(
                    "/subjects",
                    payload
                );
            }

            navigate("/subjects");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save subject."
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading subject...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        SUBJECT MANAGEMENT
                    </p>

                    <h1>
                        {editing
                            ? "Edit Subject"
                            : "Add Subject"}
                    </h1>

                    <p>
                        {editing
                            ? "Update subject information."
                            : "Create a new subject record."}
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
                            <h3>Subject Details</h3>
                            <p>
                                Enter the subject's core
                                information.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Subject Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Data Structures"
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
                                    Subject Code *
                                </label>

                                <input
                                    type="text"
                                    name="code"
                                    placeholder="e.g. CS201"
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
                                    Credits
                                </label>

                                <input
                                    type="number"
                                    name="credits"
                                    placeholder="e.g. 3"
                                    min="1"
                                    value={
                                        formData.credits
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Semester
                                </label>

                                <select
                                    name="semester"
                                    value={
                                        formData.semester
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select Semester
                                    </option>

                                    {Array.from(
                                        { length: 8 },
                                        (_, index) => (
                                            <option
                                                key={
                                                    index + 1
                                                }
                                                value={
                                                    index +
                                                    1
                                                }
                                            >
                                                Semester{" "}
                                                {index +
                                                    1}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">
                            <h3>Assignment</h3>
                            <p>
                                Assign department and
                                faculty to this subject.
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
                                        (department) => (
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
                                    Faculty
                                </label>

                                <select
                                    name="faculty"
                                    value={
                                        formData.faculty
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select Faculty
                                    </option>

                                    {faculty.map(
                                        (member) => (
                                            <option
                                                key={
                                                    member._id
                                                }
                                                value={
                                                    member._id
                                                }
                                            >
                                                {
                                                    member.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate("/subjects")
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
                                ? "Update Subject"
                                : "Create Subject"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default SubjectForm;
