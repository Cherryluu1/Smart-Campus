import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// RoleProtectedRoute: wraps routes that only admin/faculty can access.
// Students who open a "new" or "edit" page are redirected back to the list.
const RoleProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    const role = (user?.role || "student").toLowerCase();

    if (!allowedRoles.map((r) => r.toLowerCase()).includes(role)) {
        // Redirect to the parent list page (strip the /new or /edit/<id> part)
        const listPath = location.pathname
            .replace(/\/new$/, "")
            .replace(/\/edit\/[^/]+$/, "");
        return <Navigate to={listPath || "/dashboard"} replace />;
    }

    return <Outlet />;
};

export default RoleProtectedRoute;
