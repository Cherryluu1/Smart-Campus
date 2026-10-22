import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import api from "../services/api";

const PlacementForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const editing = Boolean(id);

    const [formData, setFormData] = useState({
        companyName: "",
        jobRole: "",
        description: "",
        eligibility: "",
        package: "",
        location: "",
        applicationDeadline: "",
        applicationLink: ""
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] =
        useState(editing);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editing) {
            loadPlacement();
        }
    }, [id]);

    const loadPlacement = async () => {
        try {
            const response =
                await api.get(`/placements/${id}`);

            const placement = response.data;

            setFormData({
                companyName: placement.companyName || "",
                jobRole: placement.jobRole || "",
                description: placement.description || "",
                eligibility: placement.eligibility || "",
                package: placement.package || "",
                location: placement.location || "",
                applicationDeadline:
                    placement.applicationDeadline
                        ? new Date(placement.applicationDeadline)
                              .toISOString()
                              .split("T")[0]
                        : "",
                applicationLink:
                    placement.applicationLink || ""
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load placement."
            );
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !formData.companyName ||
            !formData.jobRole
        ) {
            setError(
                "Company name and job role are required."
            );

            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                applicationDeadline:
                    formData.applicationDeadline ||
                    undefined,
                applicationLink:
                    formData.applicationLink || undefined
            };

            if (editing) {
                await api.put(
                    `/placements/${id}`,
                    payload
                );
            } else {
                await api.post(
                    "/placements",
                    payload
                );
            }

            navigate("/placements");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save placement."
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading placement...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        PLACEMENT MANAGEMENT
                    </p>

                    <h1>
                        {editing
                            ? "Edit Placement"
                            : "Add Placement"}
                    </h1>

                    <p>
                        {editing
                            ? "Update placement information."
                            : "Create a new placement opportunity."}
                    </p>
                </div>
            </div>

            <section className="content-card form-card">
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="form-section-title">
                            <h3>Company Details</h3>
                            <p>
                                Enter the company and role
                                information.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Company Name *
                                </label>

                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="e.g. Google"
                                    value={
                                        formData.companyName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Job Role *
                                </label>

                                <input
                                    type="text"
                                    name="jobRole"
                                    placeholder="e.g. Software Engineer"
                                    value={
                                        formData.jobRole
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Package
                                </label>

                                <input
                                    type="text"
                                    name="package"
                                    placeholder="e.g. 12 LPA"
                                    value={
                                        formData.package
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    placeholder="e.g. Bangalore"
                                    value={
                                        formData.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">
                            <h3>Application Info</h3>
                            <p>
                                Enter eligibility and
                                application details.
                            </p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    Eligibility
                                </label>

                                <input
                                    type="text"
                                    name="eligibility"
                                    placeholder="e.g. 7.0 CGPA and above"
                                    value={
                                        formData.eligibility
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Application Deadline
                                </label>

                                <input
                                    type="date"
                                    name="applicationDeadline"
                                    value={
                                        formData.applicationDeadline
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Application Link
                                </label>

                                <input
                                    type="url"
                                    name="applicationLink"
                                    placeholder="https://..."
                                    value={
                                        formData.applicationLink
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    placeholder="Enter job description..."
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate("/placements")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : editing
                                ? "Update Placement"
                                : "Create Placement"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default PlacementForm;
