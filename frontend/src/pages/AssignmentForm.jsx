import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import api from "../services/api";

const AssignmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = Boolean(id);

    const [subjects, setSubjects] = useState([]);
    const [faculty, setFaculty] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        subject: "",
        faculty: "",
        dueDate: "",
        maxMarks: 100
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] =
        useState(editing);
    const [error, setError] = useState("");

    useEffect(() => {
        loadSubjects();
        loadFaculty();

        if (editing) {
            loadAssignment();
        }
    }, [id]);

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

    const loadFaculty = async () => {
        try {
            const response = await api.get("/faculty");

            setFaculty(response.data);
        } catch (error) {
            console.error(
                "Faculty loading error:",
                error
            );
        }
    };

    const loadAssignment = async () => {
        try {
            const response =
                await api.get(`/assignments/${id}`);

            const assignment = response.data;

            setFormData({
                title: assignment.title || "",
                description:
                    assignment.description || "",
                subject:
                    assignment.subject?._id ||
                    assignment.subject ||
                    "",
                faculty:
                    assignment.faculty?._id ||
                    assignment.faculty ||
                    "",
                dueDate: assignment.dueDate
                    ? new Date(assignment.dueDate)
                          .toISOString()
                          .split("T")[0]
                    : "",
                maxMarks:
                    assignment.maxMarks ?? 100
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load assignment."
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
            !formData.dueDate
        ) {
            setError(
                "Title, subject and due date are required."
            );

            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                maxMarks: formData.maxMarks
                    ? Number(formData.maxMarks)
                    : 100,
                faculty:
                    formData.faculty || undefined
            };

            if (editing) {
                await api.put(
                    `/assignments/${id}`,
                    payload
                );
            } else {
                await api.post(
                    "/assignments",
                    payload
                );
            }

            navigate("/assignments");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save assignment."
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading assignment...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        ASSIGNMENT MANAGEMENT
                    </p>

                    <h1>
                        {editing
                            ? "Edit Assignment"
                            : "Add Assignment"}
                    </h1>

                    <p>
                        {editing
                            ? "Update assignment information."
                            : "Create a new assignment record."}
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
                            <h3>Assignment Details</h3>
                            <p>
                                Enter the assignment's
                                title, description and
                                marks.
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
                                    placeholder="Enter assignment title"
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
                                    Max Marks
                                </label>

                                <input
                                    type="number"
                                    name="maxMarks"
                                    placeholder="100"
                                    value={
                                        formData.maxMarks
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
                                    placeholder="Enter assignment description"
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

                    <div className="form-section">
                        <div className="form-section-title">
                            <h3>Assignment Info</h3>
                            <p>
                                Assign subject, faculty
                                and due date.
                            </p>
                        </div>

                        <div className="form-grid">
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

                            <div className="form-group">
                                <label>
                                    Due Date *
                                </label>

                                <input
                                    type="date"
                                    name="dueDate"
                                    value={
                                        formData.dueDate
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
                                navigate("/assignments")
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
                                ? "Update Assignment"
                                : "Create Assignment"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default AssignmentForm;
