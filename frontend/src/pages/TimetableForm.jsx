import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import api from "../services/api";

const TimetableForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = Boolean(id);

    const [subjects, setSubjects] = useState([]);
    const [faculty, setFaculty] = useState([]);

    const [formData, setFormData] = useState({
        day: "",
        subject: "",
        faculty: "",
        section: "",
        startTime: "",
        endTime: "",
        room: "",
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] =
        useState(editing);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDropdowns();

        if (editing) {
            loadEntry();
        }
    }, [id]);

    const loadDropdowns = async () => {
        try {
            const [subjectsRes, facultyRes] =
                await Promise.all([
                    api.get("/subjects"),
                    api.get("/faculty"),
                ]);

            setSubjects(subjectsRes.data);
            setFaculty(facultyRes.data);
        } catch (error) {
            console.error(
                "Dropdown loading error:",
                error
            );
        }
    };

    const loadEntry = async () => {
        try {
            const response =
                await api.get(`/timetable/${id}`);

            const entry = response.data;

            setFormData({
                day: entry.day || "",
                subject:
                    entry.subject?._id ||
                    entry.subject ||
                    "",
                faculty:
                    entry.faculty?._id ||
                    entry.faculty ||
                    "",
                section: entry.section || "",
                startTime: entry.startTime || "",
                endTime: entry.endTime || "",
                room: entry.room || "",
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load timetable entry."
            );
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !formData.day ||
            !formData.subject ||
            !formData.startTime ||
            !formData.endTime
        ) {
            setError(
                "Day, subject, start time and end time are required."
            );

            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                faculty: formData.faculty || undefined,
                section: formData.section || undefined,
                room: formData.room || undefined,
            };

            if (editing) {
                await api.put(
                    `/timetable/${id}`,
                    payload
                );
            } else {
                await api.post("/timetable", payload);
            }

            navigate("/timetable");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save timetable entry."
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading timetable entry...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        TIMETABLE MANAGEMENT
                    </p>

                    <h1>
                        {editing
                            ? "Edit Timetable Entry"
                            : "Add Timetable Entry"}
                    </h1>

                    <p>
                        {editing
                            ? "Update the timetable entry details."
                            : "Create a new timetable entry."}
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
                    {/* ── Class Info ── */}
                    <div className="form-section">
                        <div className="form-section-title">
                            <h3>Class Info</h3>
                            <p>
                                Select the day, subject,
                                faculty and section.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Day *</label>

                                <select
                                    name="day"
                                    value={formData.day}
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        Select Day
                                    </option>

                                    {[
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday",
                                    ].map((d) => (
                                        <option
                                            key={d}
                                            value={d}
                                        >
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Subject *</label>

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
                                                {subject.code
                                                    ? ` (${subject.code})`
                                                    : ""}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Faculty</label>

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
                                <label>Section</label>

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

                    {/* ── Schedule ── */}
                    <div className="form-section">
                        <div className="form-section-title">
                            <h3>Schedule</h3>
                            <p>
                                Set the time slot and
                                room.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Start Time *
                                </label>

                                <input
                                    type="time"
                                    name="startTime"
                                    value={
                                        formData.startTime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    End Time *
                                </label>

                                <input
                                    type="time"
                                    name="endTime"
                                    value={
                                        formData.endTime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Room</label>

                                <input
                                    type="text"
                                    name="room"
                                    placeholder="e.g. A-101"
                                    value={formData.room}
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
                                navigate("/timetable")
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
                                ? "Update Entry"
                                : "Create Entry"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default TimetableForm;
