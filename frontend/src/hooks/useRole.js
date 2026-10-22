import { useAuth } from "../context/AuthContext";

/**
 * useRole — convenience hook for role checks.
 *
 * Returns:
 *   role       — "admin" | "faculty" | "student"
 *   canEdit    — true if admin or faculty
 *   isAdmin    — true if admin
 *   isFaculty  — true if faculty
 *   isStudent  — true if student
 */
const useRole = () => {
    const { user } = useAuth();
    const role = (user?.role || "student").toLowerCase();

    return {
        role,
        canEdit: role === "admin" || role === "faculty",
        isAdmin: role === "admin",
        isFaculty: role === "faculty",
        isStudent: role === "student",
    };
};

export default useRole;
