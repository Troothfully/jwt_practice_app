import { useState } from "react";
import { login } from "../services/api";

function LoginForm({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await login(username, password);

            if (!response.token) {
                throw new Error("The server did not return a token.");
            }

            onLogin(response.token, username);

            setUsername("");
            setPassword("");
        } catch (requestError) {
            setError(
                requestError.message ||
                "Unable to log in."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="card">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">
                        Username
                    </label>

                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        placeholder="Enter username"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Enter password"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {error && (
                <p className="error-message">{error}</p>
            )}

            <div className="credentials">
                <p>
                    <strong>Admin:</strong> admin / admin123
                </p>

                <p>
                    <strong>User:</strong> user / user123
                </p>
            </div>
        </section>
    );
}

export default LoginForm;