import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAdminMessage,
    getUserMessage,
} from "../services/api";

function ProtectedPanel({ token, username, onLogout }) {
    const [error, setError] = useState("");
    const [loadingEndpoint, setLoadingEndpoint] = useState("");

    const navigate = useNavigate();

    async function callEndpoint(endpointName) {
        setError("");
        setLoadingEndpoint(endpointName);

        try {
            if (endpointName === "admin") {
                // The backend verifies that the user has ROLE_ADMIN.
                await getAdminMessage(token);

                // Navigate only if the API request succeeds.
                navigate("/admin-dashboard");
            } else {
                // The backend verifies that the user has USER or ADMIN access.
                await getUserMessage(token);

                // Navigate only if the API request succeeds.
                navigate("/user-dashboard");
            }
        } catch (requestError) {
            if (requestError.status === 401) {
                setError(
                    "Unauthorized: your token is missing, invalid, or expired."
                );
            } else if (requestError.status === 403) {
                setError(
                    "Access Forbidden: your account does not have the required role."
                );
            } else {
                setError(
                    requestError.message || "The request failed."
                );
            }
        } finally {
            setLoadingEndpoint("");
        }
    }

    return (
        <section className="card">
            <div className="panel-heading">
                <div>
                    <h2>Protected Endpoints</h2>

                    <p>
                        Logged in as{" "}
                        <strong>{username}</strong>
                    </p>
                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>

            <div className="button-row">
                <button
                    type="button"
                    onClick={() => callEndpoint("user")}
                    disabled={Boolean(loadingEndpoint)}
                >
                    {loadingEndpoint === "user"
                        ? "Checking access..."
                        : "Call /user"}
                </button>

                <button
                    type="button"
                    onClick={() => callEndpoint("admin")}
                    disabled={Boolean(loadingEndpoint)}
                >
                    {loadingEndpoint === "admin"
                        ? "Checking access..."
                        : "Call /admin"}
                </button>
            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}
        </section>
    );
}

export default ProtectedPanel;