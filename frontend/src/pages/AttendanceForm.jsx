import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import api from "../services/api";

const AttendanceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = Boolean(id);

    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [formData, setFormData] = useState({
        student: "",
        subject: "",
        date: "",
        status: ""
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] =
        useState(editing);
    const [error, setError] = useState("");

    useEffect(() => {
        loadStudents();
        loadSubjects();

        if (editing) {
            loadRecord();
        }
    }, [id]);

    const loadStudents = async () => {
        try {
            const response = await api.get("/students");

            setStudents(response.data);
        } catch (error) {
            console.error(
                "Student loading error:",
                error
            );
        }
    };

    const loadSubjects = async () => {
        try {
            const response = await api.get("/subjects");

            setSubjects(response.data);
        } catch (error) {
            console.error(
                "Subject loading error:",
                error
            );
        }
    };

    const loadRecord = async () => {
        try {
            const response =
                await api.get(`/attendance/${id}`);

            const record = response.data;

            setFormData({
                student:
                    record.student?._id ||
                    record.student ||
                    "",
                subject:
                    record.subject?._id ||
                    record.subject ||
                    "",
                date: record.date
                    ? new Date(record.date)
                          .toISOString()
                          .split("T")[0]
                    : "",
                status: record.status || ""
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load attendance record."
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
            !formData.student ||
            !formData.subject ||
            !formData.date ||
            !formData.status
        ) {
            setError(
                "Student, subject, date and status are required."
            );

            return;
        }

        try {
            setLoading(true);

            if (editing) {
                await api.put(
                    `/attendance/${id}`,
                    formData
                );
            } else {
                await api.post(
                    "/attendance",
                    formData
                );
            }

            navigate("/attendance");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save attendance record."
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading attendance record...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        ATTENDANCE MANAGEMENT
                    </p>

                    <h1>
                        {editing
                            ? "Edit Attendance"
                            : "Add Attendance"}
                    </h1>

                    <p>
                        {editing
                            ? "Update the attendance record."
                            : "Create a new attendance record."}
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
                            <h3>Attendance Record</h3>
                            <p>
                                Enter the attendance
                                details.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Student *
                                </label>

                                <select
                                    name="student"
                                    value={
                                        formData.student
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select Student
                                    </option>

                                    {students.map(
                                        (student) => (
                                            <option
                                                key={
                                                    student._id
                                                }
                                                value={
                                                    student._id
                                                }
                                            >
                                                {
                                                    student.name
                                                }{" "}
                                                (
                                                {
                                                    student.studentId
                                                }
                                                )
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    Subject *
                                </label>

                                <select
                                    name="subject"
                                    value={
                                        formData.subject
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select Subject
                                    </option>

                                    {subjects.map(
                                        (subject) => (
                                            <option
                                                key={
                                                    subject._id
                                                }
                                                value={
                                                    subject._id
                                                }
                                            >
                                                {
                                                    subject.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    Date *
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Status *
                                </label>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select Status
                                    </option>

                                    <option value="Present">
                                        Present
                                    </option>

                                    <option value="Absent">
                                        Absent
                                    </option>

                                    <option value="Leave">
                                        Leave
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
                                navigate("/attendance")
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
                                ? "Update Attendance"
                                : "Create Attendance"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default AttendanceForm;
