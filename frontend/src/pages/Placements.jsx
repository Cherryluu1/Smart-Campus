import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRole from "../hooks/useRole";

const Placements = () => {
    const [placements, setPlacements] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { canEdit } = useRole();

    useEffect(() => {
        loadPlacements();
    }, []);

    const loadPlacements = async () => {
        try {
            setLoading(true);

            const response = await api.get("/placements");

            setPlacements(response.data);
            setError("");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load placements."
            );
        } finally {
            setLoading(false);
        }
    };

    const deletePlacement = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this placement?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/placements/${id}`);

            setPlacements((current) =>
                current.filter(
                    (placement) => placement._id !== id
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete placement."
            );
        }
    };

    const filteredPlacements = placements.filter((placement) => {
        const text = search.toLowerCase();

        return (
            placement.companyName?.toLowerCase().includes(text) ||
            placement.jobRole?.toLowerCase().includes(text) ||
            placement.location?.toLowerCase().includes(text) ||
            placement.package?.toLowerCase().includes(text)
        );
    });

    return (
        <div className="page-container">
            <div className="page-heading students-heading">
                <div>
                    <p className="eyebrow">
                        CAMPUS MANAGEMENT
                    </p>

                    <h1>Placements</h1>

                    <p>
                        Manage and view all placement
                        opportunities.
                    </p>
                </div>

                {canEdit ? (
                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/placements/new")
                        }
                    >
                        + Add Placement
                    </button>
                ) : (
                    <span className="view-only-badge">
                        ?? VIEW ONLY
                    </span>
                )}
            </div>

            <section className="content-card">
                <div className="table-toolbar">
                    <div>
                        <h3>Placement Directory</h3>

                        <p>
                            {placements.length} placement
                            {placements.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <div className="search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search placements..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading placements...</p>
                    </div>
                ) : filteredPlacements.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            ⌂
                        </div>

                        <h3>
                            {search
                                ? "No placements found"
                                : "No placements yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try another search term."
                                : "Add your first placement to get started."}
                        </p>

                        {!search && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        "/placements/new"
                                    )
                                }
                            >
                                Add Placement
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Job Role</th>
                                    <th>Package</th>
                                    <th>Location</th>
                                    <th>Deadline</th>
                                    {canEdit && <th>Actions</th>}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredPlacements.map(
                                    (placement) => (
                                        <tr
                                            key={
                                                placement._id
                                            }
                                        >
                                            <td>
                                                <div className="student-cell">
                                                    <div className="table-avatar">
                                                        {placement.companyName
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {
                                                            placement.companyName
                                                        }
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                {
                                                    placement.jobRole ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    placement.package ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    placement.location ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {placement.applicationDeadline
                                                    ? new Date(
                                                          placement.applicationDeadline
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            {canEdit && (<td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/placements/edit/${placement._id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deletePlacement(
                                                                placement._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>)}
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Placements;
