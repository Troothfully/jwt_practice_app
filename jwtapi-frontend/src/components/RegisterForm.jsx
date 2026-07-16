import { useState } from "react";
import { register } from "../services/api";

function RegisterForm({ onRegistrationComplete }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await register(
                username,
                password
            );

            setSuccess(response.message);

            setUsername("");
            setPassword("");
            setConfirmPassword("");

            if (onRegistrationComplete) {
                onRegistrationComplete();
            }
        } catch (requestError) {
            setError(
                requestError.message ||
                "Unable to create the account."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="card">
            <h2>Create Account</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="register-username">
                        Username
                    </label>

                    <input
                        id="register-username"
                        type="text"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        placeholder="Choose a username"
                        minLength={3}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="register-password">
                        Password
                    </label>

                    <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Choose a password"
                        minLength={6}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirm-password">
                        Confirm Password
                    </label>

                    <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(
                                event.target.value
                            )
                        }
                        placeholder="Enter password again"
                        minLength={6}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading
                        ? "Creating account..."
                        : "Create Account"}
                </button>
            </form>

            {success && (
                <p className="success-message">
                    {success}. You may now log in.
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

export default RegisterForm;