import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();

    const [stats, setStats] = useState({
        students: 0,
        faculty: 0,
        events: 0,
        assignments: 0,
        exams: 0,
        notifications: 0
    });

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const results = await Promise.allSettled([
                api.get("/students"),
                api.get("/faculty"),
                api.get("/events"),
                api.get("/assignments"),
                api.get("/exams"),
                api.get("/notifications")
            ]);

            const getData = (result) =>
                result.status === "fulfilled" && Array.isArray(result.value?.data)
                    ? result.value.data
                    : [];

            const studentsData = getData(results[0]);
            const facultyData = getData(results[1]);
            const eventsData = getData(results[2]);
            const assignmentsData = getData(results[3]);
            const examsData = getData(results[4]);
            const notificationsData = getData(results[5]);

            setStats({
                students: studentsData.length,
                faculty: facultyData.length,
                events: eventsData.length,
                assignments: assignmentsData.length,
                exams: examsData.length,
                notifications: notificationsData.length
            });

            setEvents(eventsData.slice(0, 5));
        } catch (error) {
            console.error(
                "Dashboard loading error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        SMARTCAMPUS OVERVIEW
                    </p>

                    <h1>
                        Welcome, {user?.name || user?.fullName || "Student"} 👋
                    </h1>

                    <p>
                        Here's what's happening across your
                        campus today.
                    </p>
                </div>

                <div className="date-card">
                    <span>Today</span>
                    <strong>
                        {new Date().toLocaleDateString(
                            "en-IN",
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            }
                        )}
                    </strong>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">
                        ♙
                    </div>

                    <div>
                        <span>Total Students</span>
                        <h2>
                            {loading
                                ? "..."
                                : stats.students}
                        </h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon purple">
                        ◉
                    </div>

                    <div>
                        <span>Faculty Members</span>
                        <h2>
                            {loading
                                ? "..."
                                : stats.faculty}
                        </h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">
                        ◆
                    </div>

                    <div>
                        <span>Campus Events</span>
                        <h2>
                            {loading
                                ? "..."
                                : stats.events}
                        </h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orange">
                        ▣
                    </div>

                    <div>
                        <span>Assignments</span>
                        <h2>
                            {loading
                                ? "..."
                                : stats.assignments}
                        </h2>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <section className="content-card">
                    <div className="card-header">
                        <div>
                            <h3>Upcoming Events</h3>
                            <p>
                                Latest campus activities
                            </p>
                        </div>

                        <Link to="/modules">
                            View All
                        </Link>
                    </div>

                    {events.length === 0 ? (
                        <div className="empty-state">
                            <div>◆</div>
                            <h4>No events available</h4>
                            <p>
                                Campus events will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="event-list">
                            {events.map((event) => (
                                <div
                                    className="event-item"
                                    key={event._id}
                                >
                                    <div className="event-date">
                                        <strong>
                                            {new Date(
                                                event.date
                                            ).getDate()}
                                        </strong>

                                        <span>
                                            {new Date(
                                                event.date
                                            ).toLocaleDateString(
                                                "en-US",
                                                {
                                                    month: "short"
                                                }
                                            )}
                                        </span>
                                    </div>

                                    <div className="event-content">
                                        <h4>
                                            {event.title}
                                        </h4>

                                        <p>
                                            {event.venue ||
                                                "Campus Venue"}
                                        </p>
                                    </div>

                                    <span className="event-category">
                                        {event.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="content-card quick-card">
                    <div className="card-header">
                        <div>
                            <h3>Quick Access</h3>
                            <p>
                                Frequently used sections
                            </p>
                        </div>
                    </div>

                    <div className="quick-links">
                        <Link to="/students">
                            <span>♙</span>
                            <div>
                                <strong>Students</strong>
                                <small>
                                    Manage student records
                                </small>
                            </div>
                        </Link>

                        <Link to="/modules">
                            <span>▦</span>
                            <div>
                                <strong>
                                    Campus Modules
                                </strong>
                                <small>
                                    Access all modules
                                </small>
                            </div>
                        </Link>

                        <Link to="/profile">
                            <span>◉</span>
                            <div>
                                <strong>My Profile</strong>
                                <small>
                                    View your account
                                </small>
                            </div>
                        </Link>

                        <Link to="/login">
                            <span>⇄</span>
                            <div>
                                <strong>Sign In / Switch</strong>
                                <small>
                                    Switch user account
                                </small>
                            </div>
                        </Link>
                    </div>
                </section>
            </div>

            <div className="mini-stats">
                <div>
                    <span>Examinations</span>
                    <strong>{stats.exams}</strong>
                </div>

                <div>
                    <span>Notifications</span>
                    <strong>{stats.notifications}</strong>
                </div>

                <div>
                    <span>System</span>
                    <strong className="online-text">
                        Online
                    </strong>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;