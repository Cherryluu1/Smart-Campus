import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import api from "../services/api";

const ExamForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = Boolean(id);

    const [subjects, setSubjects] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        type: "",
        subject: "",
        totalMarks: "",
        date: "",
        time: "",
        duration: "",
        venue: "",
        description: ""
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] =
        useState(editing);
    const [error, setError] = useState("");

    useEffect(() => {
        loadSubjects();

        if (editing) {
            loadExam();
        }
    }, [id]);

    const loadSubjects = async () => {
        try {
            const response =
                await api.get("/subjects");

            setSubjects(response.data);
        } catch (error) {
            console.error(
                "Subject loading error:",
                error
            );
        }
    };

    const loadExam = async () => {
        try {
            const response =
                await api.get(`/exams/${id}`);

            const exam = response.data;

            setFormData({
                title: exam.title || "",
                type: exam.type || "",
                subject:
                    exam.subject?._id ||
                    exam.subject ||
                    "",
                totalMarks: exam.totalMarks ?? "",
                date: exam.date
                    ? new Date(exam.date)
                          .toISOString()
                          .split("T")[0]
                    : "",
                time: exam.time || "",
                duration: exam.duration ?? "",
                venue: exam.venue || "",
                description: exam.description || ""
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load exam."
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
            !formData.title ||
            !formData.subject ||
            !formData.date
        ) {
            setError(
                "Title, subject and date are required."
            );

            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                totalMarks: formData.totalMarks !== ""
                    ? Number(formData.totalMarks)
                    : undefined,
                duration: formData.duration !== ""
                    ? Number(formData.duration)
                    : undefined,
                subject:
                    formData.subject || undefined,
                type:
                    formData.type || undefined
            };

            if (editing) {
                await api.put(
                    `/exams/${id}`,
                    payload
                );
            } else {
                await api.post(
                    "/exams",
                    payload
                );
            }

            navigate("/exams");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save exam."
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading exam...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        EXAM MANAGEMENT
                    </p>

                    <h1>
                        {editing
                            ? "Edit Exam"
                            : "Add Exam"}
                    </h1>

                    <p>
                        {editing
                            ? "Update exam information."
                            : "Schedule a new exam."}
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
                            <h3>Exam Details</h3>
                            <p>
                                Enter the exam's core
                                information.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Title *
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter exam title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Type
                                </label>

                                <select
                                    name="type"
                                    value={
                                        formData.type
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select Type
                                    </option>

                                    <option value="Mid-Term">
                                        Mid-Term
                                    </option>

                                    <option value="End-Term">
                                        End-Term
                                    </option>

                                    <option value="Quiz">
                                        Quiz
                                    </option>

                                    <option value="Practical">
                                        Practical
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
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
                                    Total Marks
                                </label>

                                <input
                                    type="number"
                                    name="totalMarks"
                                    placeholder="Enter total marks"
                                    value={
                                        formData.totalMarks
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
                            <h3>Schedule & Venue</h3>
                            <p>
                                Set the date, time and
                                location of the exam.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Date *
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    value={
                                        formData.date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Time
                                </label>

                                <input
                                    type="text"
                                    name="time"
                                    placeholder="e.g. 10:00 AM"
                                    value={
                                        formData.time
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Duration
                                </label>

                                <input
                                    type="number"
                                    name="duration"
                                    placeholder="minutes"
                                    value={
                                        formData.duration
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Venue
                                </label>

                                <input
                                    type="text"
                                    name="venue"
                                    placeholder="Enter venue"
                                    value={
                                        formData.venue
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

                                <textarea
                                    name="description"
                                    placeholder="Enter additional details"
                                    value={
                                        formData.description
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
                                navigate("/exams")
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
                                ? "Update Exam"
                                : "Create Exam"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default ExamForm;
