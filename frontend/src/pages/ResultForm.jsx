import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import api from "../services/api";

const ResultForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = Boolean(id);

    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [exams, setExams] = useState([]);

    const [formData, setFormData] = useState({
        student: "",
        subject: "",
        exam: "",
        marks: "",
        maxMarks: "100",
        grade: "",
        semester: ""
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] =
        useState(editing);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDropdowns();

        if (editing) {
            loadResult();
        }
    }, [id]);

    const loadDropdowns = async () => {
        try {
            const [studentsRes, subjectsRes, examsRes] =
                await Promise.all([
                    api.get("/students"),
                    api.get("/subjects"),
                    api.get("/exams")
                ]);

            setStudents(studentsRes.data);
            setSubjects(subjectsRes.data);
            setExams(examsRes.data);
        } catch (error) {
            console.error(
                "Dropdown loading error:",
                error
            );
        }
    };

    const loadResult = async () => {
        try {
            const response =
                await api.get(`/results/${id}`);

            const result = response.data;

            setFormData({
                student:
                    result.student?._id ||
                    result.student ||
                    "",
                subject:
                    result.subject?._id ||
                    result.subject ||
                    "",
                exam:
                    result.exam?._id ||
                    result.exam ||
                    "",
                marks: result.marks ?? "",
                maxMarks: result.maxMarks ?? "100",
                grade: result.grade || "",
                semester: result.semester ?? ""
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load result."
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
            formData.marks === ""
        ) {
            setError(
                "Student, subject and marks are required."
            );

            return;
        }

        try {
            setLoading(true);

            const payload = {
                student: formData.student,
                subject: formData.subject,
                exam: formData.exam || undefined,
                marks: Number(formData.marks),
                maxMarks: formData.maxMarks
                    ? Number(formData.maxMarks)
                    : 100,
                grade: formData.grade || undefined,
                semester: formData.semester
                    ? Number(formData.semester)
                    : undefined
            };

            if (editing) {
                await api.put(
                    `/results/${id}`,
                    payload
                );
            } else {
                await api.post("/results", payload);
            }

            navigate("/results");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save result."
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading result...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        RESULT MANAGEMENT
                    </p>

                    <h1>
                        {editing
                            ? "Edit Result"
                            : "Add Result"}
                    </h1>

                    <p>
                        {editing
                            ? "Update result information."
                            : "Create a new result record."}
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
                            <h3>Student & Subject</h3>
                            <p>
                                Select the student,
                                subject and exam.
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
                                <label>Exam</label>

                                <select
                                    name="exam"
                                    value={
                                        formData.exam
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select Exam
                                    </option>

                                    {exams.map(
                                        (exam) => (
                                            <option
                                                key={
                                                    exam._id
                                                }
                                                value={
                                                    exam._id
                                                }
                                            >
                                                {
                                                    exam.title
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">
                            <h3>Marks & Grade</h3>
                            <p>
                                Enter marks, grade and
                                semester details.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Marks *</label>

                                <input
                                    type="number"
                                    name="marks"
                                    placeholder="e.g. 85"
                                    value={
                                        formData.marks
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
                                    placeholder="e.g. 100"
                                    value={
                                        formData.maxMarks
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Grade</label>

                                <select
                                    name="grade"
                                    value={
                                        formData.grade
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select Grade
                                    </option>

                                    {[
                                        "O",
                                        "A+",
                                        "A",
                                        "B+",
                                        "B",
                                        "C",
                                        "F"
                                    ].map((g) => (
                                        <option
                                            key={g}
                                            value={g}
                                        >
                                            {g}
                                        </option>
                                    ))}
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
                                                    index +
                                                    1
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

                    <div className="form-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate("/results")
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
                                ? "Update Result"
                                : "Create Result"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default ResultForm;
