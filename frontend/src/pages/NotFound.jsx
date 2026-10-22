import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="not-found">
            <div className="not-found-number">
                404
            </div>

            <h1>Page Not Found</h1>

            <p>
                The page you're looking for doesn't exist
                or has been moved.
            </p>

            <Link
                to="/dashboard"
                className="primary-button"
            >
                Back to Dashboard
            </Link>
        </div>
    );
};

export default NotFound;