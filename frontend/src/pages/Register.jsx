import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard", { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const {
            name,
            email,
            password,
            confirmPassword
        } = formData;

        if (!name || !email || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await register(
                name,
                email,
                password
            );

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed."
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
                        Join your smart campus community
                    </p>
                </div>

                <div className="auth-card register-card">
                    <div className="auth-card-header">
                        <h2>Create Account</h2>

                        <p>
                            Register for SmartCampus
                        </p>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Password</label>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Minimum 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <p className="auth-note" style={{ fontSize: "0.85rem", opacity: 0.75, margin: "0 0 12px" }}>
                            Self-registration creates a Student account.
                            Faculty accounts are created by the administrator.
                        </p>

                        <button
                            className="primary-button auth-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;