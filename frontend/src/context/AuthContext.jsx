import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

const normalizeUser = (u) => {
    if (!u) return null;
    const actualUser = u.user || u;
    const name =
        actualUser.name ||
        actualUser.fullName ||
        (actualUser.email ? actualUser.email.split("@")[0] : "User");
    const role =
        actualUser.role ||
        actualUser.accountType ||
        "Student";
    const accountType =
        actualUser.accountType ||
        (role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "Student");

    return {
        ...actualUser,
        id: actualUser.id || actualUser._id,
        _id: actualUser._id || actualUser.id,
        name,
        fullName: actualUser.fullName || name,
        role: role.toLowerCase(),
        accountType
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("smartcampus_user");
        const token = localStorage.getItem("smartcampus_token");

        if (savedUser && token) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(normalizeUser(parsed));
            } catch {
                localStorage.removeItem("smartcampus_user");
                localStorage.removeItem("smartcampus_token");
            }
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post("/users/login", {
            email,
            password
        });

        const rawUser = response.data.user || response.data;
        const token = response.data.token;
        const normalized = normalizeUser(rawUser);

        localStorage.setItem(
            "smartcampus_user",
            JSON.stringify(normalized)
        );

        localStorage.setItem(
            "smartcampus_token",
            token
        );

        setUser(normalized);

        return response.data;
    };

    // Public self-registration creates STUDENT accounts only.
    // (Faculty/admin accounts are created by an admin.)
    const register = async (name, email, password) => {
        const response = await api.post("/users/register", {
            name,
            email,
            password
        });

        const normalized = normalizeUser(response.data.user || response.data);

        localStorage.setItem(
            "smartcampus_user",
            JSON.stringify(normalized)
        );

        localStorage.setItem(
            "smartcampus_token",
            response.data.token
        );

        setUser(normalized);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem("smartcampus_user");
        localStorage.removeItem("smartcampus_token");

        setUser(null);
    };

    const refreshProfile = async () => {
        try {
            const response = await api.get("/users/profile");
            const rawUser = response.data.user || response.data;
            const normalized = normalizeUser(rawUser);

            localStorage.setItem(
                "smartcampus_user",
                JSON.stringify(normalized)
            );

            setUser(normalized);
            return normalized;
        } catch (err) {
            console.error("Profile refresh failed:", err);
            return null;
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};