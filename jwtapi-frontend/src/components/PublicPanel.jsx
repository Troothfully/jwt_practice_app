import { useState } from "react";
import { getPublicMessage } from "../services/api";

function PublicPanel() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handlePublicRequest() {
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await getPublicMessage();
            setMessage(response.message);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="card">
            <h2>Public Endpoint</h2>

            <p>
                This endpoint does not require a JWT.
            </p>

            <button
                type="button"
                onClick={handlePublicRequest}
                disabled={loading}
            >
                {loading
                    ? "Loading..."
                    : "Call /hello"}
            </button>

            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}
        </section>
    );
}

export default PublicPanel;