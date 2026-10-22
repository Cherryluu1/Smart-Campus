import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const role = (user?.role || "student").toLowerCase();

    const roleLabel = {
        admin: "Administrator",
        faculty: "Faculty",
        student: "Student",
    }[role] || "User";

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <button className="menu-button" onClick={onMenuClick}>
                    ☰
                </button>

                <div
                    className="navbar-brand"
                    onClick={() => navigate("/dashboard")}
                >
                    <div className="brand-icon">S</div>

                    <div>
                        <h2>SmartCampus</h2>
                        <span>Campus Management System</span>
                    </div>
                </div>
            </div>

            <div className="navbar-right">
                {user ? (
                    <>
                        <div
                            className="navbar-profile"
                            onClick={() => navigate("/profile")}
                        >
                            <div className="avatar">
                                {(user?.name || user?.fullName)
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </div>

                            <div className="user-info">
                                <strong>
                                    {user?.name || user?.fullName || "User"}
                                </strong>
                                <small>{roleLabel}</small>
                            </div>
                        </div>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        className="primary-button"
                        onClick={() => navigate("/login")}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;