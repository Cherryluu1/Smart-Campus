import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const role = (user?.role || "student").toLowerCase();

    const handleLogout = () => {
        logout();
        navigate("/login");
        onClose();
    };

    const mainLinks = [
        { name: "Dashboard", path: "/dashboard", icon: "⌂" },
        { name: "Profile",   path: "/profile",   icon: "◉" },
        { name: "Modules",   path: "/modules",   icon: "▦" },
    ];

    const moduleLinks = [
        { name: "Students",      path: "/students",      icon: "♙" },
        { name: "Faculty",       path: "/faculty",        icon: "◉" },
        { name: "Departments",   path: "/departments",    icon: "▦" },
        { name: "Subjects",      path: "/subjects",       icon: "▤" },
        { name: "Attendance",    path: "/attendance",     icon: "✓" },
        { name: "Assignments",   path: "/assignments",    icon: "▣" },
        { name: "Exams",         path: "/exams",          icon: "✎" },
        { name: "Results",       path: "/results",        icon: "★" },
        { name: "Events",        path: "/events",         icon: "◆" },
        { name: "Materials",     path: "/materials",      icon: "▤" },
        { name: "Notifications", path: "/notifications",  icon: "!" },
        { name: "Placements",    path: "/placements",     icon: "⌂" },
        { name: "Timetable",     path: "/timetable",      icon: "◷" },
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
                {/* Header */}
                <div className="sidebar-header">
                    <div className="campus-symbol">SC</div>
                    <div>
                        <h3>SmartCampus</h3>
                        <span>Management Portal</span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav">
                    <p className="nav-title">MAIN MENU</p>

                    {mainLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                            }
                            onClick={onClose}
                        >
                            <span className="nav-icon">{link.icon}</span>
                            <span>{link.name}</span>
                        </NavLink>
                    ))}

                    <p className="nav-title module-title">CAMPUS MODULES</p>

                    {moduleLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                            }
                            onClick={onClose}
                        >
                            <span className="nav-icon">{link.icon}</span>
                            <span>{link.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    {user && (
                        <div className="sidebar-user-badge">
                            <span className="sidebar-user-avatar">
                                {(user?.name || user?.fullName)
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </span>
                            <div className="sidebar-user-details">
                                <strong>
                                    {user?.name || user?.fullName || "User"}
                                </strong>
                                <small>{role}</small>
                            </div>
                        </div>
                    )}

                    <div className="system-status">
                        <span className="status-dot" />
                        <div>
                            <strong>System Online</strong>
                            <small>SmartCampus API</small>
                        </div>
                    </div>

                    <button
                        className="sidebar-link sidebar-auth-link"
                        style={{ width: "100%", marginTop: "8px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                        onClick={handleLogout}
                    >
                        <span className="nav-icon">⇄</span>
                        <span>Logout</span>
                    </button>

                    <small className="version">SmartCampus v2.0</small>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;