import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Profile = () => {
    const { user, refreshProfile } = useAuth();

    const [profile, setProfile] = useState(user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await api.get("/users/profile");
            const userData = response.data.user || response.data;

            setProfile(userData);

            await refreshProfile();
        } catch (error) {
            console.error(
                "Profile loading error:",
                error
            );

            setProfile(user);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">
                        ACCOUNT
                    </p>

                    <h1>My Profile</h1>

                    <p>
                        View your SmartCampus account
                        information.
                    </p>
                </div>
            </div>

            <div className="profile-layout">
                <section className="profile-card">
                    <div className="profile-cover"></div>

                    <div className="profile-main">
                        <div className="profile-avatar">
                            {(profile?.name || profile?.fullName)
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <h2>
                            {profile?.name || profile?.fullName}
                        </h2>

                        <span className="role-badge">
                            {profile?.role || profile?.accountType}
                        </span>

                        <p>
                            SmartCampus User
                        </p>
                    </div>
                </section>

                <section className="content-card">
                    <div className="card-header">
                        <div>
                            <h3>Account Information</h3>
                            <p>
                                Your registered account
                                details
                            </p>
                        </div>
                    </div>

                    <div className="profile-details">
                        <div className="detail-item">
                            <span>Full Name</span>
                            <strong>
                                {profile?.fullName || profile?.name || "—"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Email Address</span>
                            <strong>
                                {profile?.email || "—"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Account Role</span>
                            <strong>
                                {profile?.role || profile?.accountType || "—"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>User ID</span>
                            <strong className="small-id">
                                {profile?._id || profile?.id || "—"}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Account Created</span>
                            <strong>
                                {profile?.createdAt
                                    ? new Date(
                                          profile.createdAt
                                      ).toLocaleDateString(
                                          "en-IN"
                                      )
                                    : "—"}
                            </strong>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;