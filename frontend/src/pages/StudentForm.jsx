import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import api from "../services/api";

const StudentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = Boolean(id);

    const [departments, setDepartments] = useState([]);

    const [formData, setFormData] = useState({
        studentId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        semester: "",
        section: ""
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] =
        useState(editing);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDepartments();

        if (editing) {
            loadStudent();
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

    const loadStudent = async () => {
        try {
            const response =
                await api.get(`/students/${id}`);

            const student = response.data;

            setFormData({
                studentId: student.studentId || "",
                name: student.name || "",
                email: student.email || "",
                phone: student.phone || "",
                department:
                    student.department?._id ||
                    student.department ||
                    "",
                year: student.year || "",
                semester: student.semester || "",
                section: student.section || ""
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load student."
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
            !formData.studentId ||
            !formData.name ||
            !formData.email
        ) {
            setError(
                "Student ID, name and email are required."
            );

            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                year: formData.year
                    ? Number(formData.year)
                    : undefined,
                semester: formData.semester
                    ? Number(formData.semester)
                    : undefined,
                department:
                    formData.department || undefined
            };

            if (editing) {
                await api.put(
                    `/students/${id}`,
                    payload
                );
            } else {
                await api.post(
                    "/students",
                    payload
                );
            }

            navigate("/students");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save student."
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading student...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        STUDENT MANAGEMENT
                    </p>

                    <h1>
                        {editing
                            ? "Edit Student"
                            : "Add Student"}
                    </h1>

                    <p>
                        {editing
                            ? "Update student information."
                            : "Create a new student record."}
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
                                Enter the student's basic
                                details.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Student ID *
                                </label>

                                <input
                                    type="text"
                                    name="studentId"
                                    placeholder="e.g. SC2026001"
                                    value={
                                        formData.studentId
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
                                    placeholder="student@example.com"
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
                            <h3>Academic Information</h3>
                            <p>
                                Enter department and
                                academic details.
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
                                    Year
                                </label>

                                <select
                                    name="year"
                                    value={
                                        formData.year
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select Year
                                    </option>

                                    <option value="1">
                                        1st Year
                                    </option>

                                    <option value="2">
                                        2nd Year
                                    </option>

                                    <option value="3">
                                        3rd Year
                                    </option>

                                    <option value="4">
                                        4th Year
                                    </option>
                                </select>
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

                            <div className="form-group">
                                <label>
                                    Section
                                </label>

                                <select
                                    name="section"
                                    value={
                                        formData.section
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select Section
                                    </option>

                                    <option value="A">
                                        Section A
                                    </option>

                                    <option value="B">
                                        Section B
                                    </option>

                                    <option value="C">
                                        Section C
                                    </option>

                                    <option value="D">
                                        Section D
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate("/students")
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
                                ? "Update Student"
                                : "Create Student"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default StudentForm;