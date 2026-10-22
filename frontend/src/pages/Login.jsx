import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, logout, user } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            await login(email, password);

            const destination =
                location.state?.from?.pathname || "/dashboard";

            navigate(destination, { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-decoration decoration-one"></div>
            <div className="auth-decoration decoration-two"></div>

            <div className="auth-container">
                <div className="auth-brand">
                    <div className="large-brand-icon">
                        S
                    </div>

                    <h1>SmartCampus</h1>

                    <p>
                        Smart Campus Management System
                    </p>
                </div>

                <div className="auth-card">
                    {user && (
                        <div className="active-session-banner">
                            <div className="session-info">
                                <span>Currently signed in as</span>
                                <strong>{user.name || user.fullName || user.email}</strong>
                                <span className="session-role">
                                    {user.role || user.accountType || "Student"}
                                </span>
                            </div>

                            <div className="session-actions">
                                <button
                                    type="button"
                                    className="session-btn dashboard-btn"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Go to Dashboard →
                                </button>

                                <button
                                    type="button"
                                    className="session-btn signout-btn"
                                    onClick={logout}
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="auth-card-header">
                        <h2>{user ? "Sign In With Another Account" : "Welcome Back"}</h2>

                        <p>
                            Sign in to access your campus portal
                        </p>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>

                            <div className="password-wrapper">
                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            className="primary-button auth-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing In..."
                                : "Sign In"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create Account
                        </Link>
                    </div>
                </div>

                <div className="auth-bottom">
                    Secure • Reliable • Smart
                </div>
            </div>
        </div>
    );
};

export default Login;