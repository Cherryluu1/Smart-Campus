import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Modules = () => {
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const modules = [
        {
            name: "Students",
            description: "Manage student records and academic information.",
            endpoint: "/students",
            route: "/students",
            icon: "♙",
            color: "blue"
        },
        {
            name: "Faculty",
            description: "Manage faculty members and departments.",
            endpoint: "/faculty",
            route: "/faculty",
            icon: "◉",
            color: "purple"
        },
        {
            name: "Departments",
            description: "Manage academic departments.",
            endpoint: "/departments",
            route: "/departments",
            icon: "▦",
            color: "green"
        },
        {
            name: "Subjects",
            description: "Manage subjects and course information.",
            endpoint: "/subjects",
            route: "/subjects",
            icon: "▤",
            color: "orange"
        },
        {
            name: "Attendance",
            description: "Track student attendance records.",
            endpoint: "/attendance",
            route: "/attendance",
            icon: "✓",
            color: "red"
        },
        {
            name: "Assignments",
            description: "Manage assignments and deadlines.",
            endpoint: "/assignments",
            route: "/assignments",
            icon: "▣",
            color: "blue"
        },
        {
            name: "Exams",
            description: "Manage examination schedules.",
            endpoint: "/exams",
            route: "/exams",
            icon: "✎",
            color: "purple"
        },
        {
            name: "Results",
            description: "Manage student examination results.",
            endpoint: "/results",
            route: "/results",
            icon: "★",
            color: "green"
        },
        {
            name: "Events",
            description: "Manage campus events and activities.",
            endpoint: "/events",
            route: "/events",
            icon: "◆",
            color: "orange"
        },
        {
            name: "Materials",
            description: "Manage study materials and resources.",
            endpoint: "/materials",
            route: "/materials",
            icon: "▤",
            color: "red"
        },
        {
            name: "Notifications",
            description: "Manage campus announcements.",
            endpoint: "/notifications",
            route: "/notifications",
            icon: "!",
            color: "blue"
        },
        {
            name: "Placements",
            description: "Manage placement opportunities.",
            endpoint: "/placements",
            route: "/placements",
            icon: "⌂",
            color: "purple"
        },
        {
            name: "Timetable",
            description: "Manage class schedules.",
            endpoint: "/timetable",
            route: "/timetable",
            icon: "◷",
            color: "green"
        }
    ];

    useEffect(() => {
        loadModuleCounts();
    }, []);

    const loadModuleCounts = async () => {
        const results = {};

        await Promise.all(
            modules.map(async (module) => {
                try {
                    const response = await api.get(
                        module.endpoint
                    );

                    results[module.name] =
                        Array.isArray(response.data)
                            ? response.data.length
                            : 0;
                } catch {
                    results[module.name] = 0;
                }
            })
        );

        setCounts(results);
        setLoading(false);
    };

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        SMARTCAMPUS
                    </p>

                    <h1>Campus Modules</h1>

                    <p>
                        Click a module to open and manage
                        its records.
                    </p>
                </div>
            </div>

            <div className="module-grid">
                {modules.map((module) => (
                    <div
                        className="module-card module-card-clickable"
                        key={module.name}
                        onClick={() =>
                            navigate(module.route)
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter" ||
                                e.key === " "
                            )
                                navigate(module.route);
                        }}
                    >
                        <div
                            className={`module-icon ${module.color}`}
                        >
                            {module.icon}
                        </div>

                        <div className="module-content">
                            <div className="module-title-row">
                                <h3>
                                    {module.name}
                                </h3>

                                <span className="module-count">
                                    {loading
                                        ? "..."
                                        : counts[
                                              module
                                                  .name
                                          ] ?? 0}
                                </span>
                            </div>

                            <p>
                                {module.description}
                            </p>

                            <span className="module-endpoint">
                                {module.endpoint}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Modules;