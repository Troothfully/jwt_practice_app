import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    deleteUser,
    getAllUsers,
    promoteUserToAdmin,
} from "../services/api";

function AdminDashboard({ token, username }) {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [pendingUserId, setPendingUserId] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        setError("");

        try {
            const data = await getAllUsers(token);
            setUsers(data);
        } catch (requestError) {
            handleRequestError(requestError);
        } finally {
            setLoading(false);
        }
    }

    async function handlePromote(user) {
        const confirmed = window.confirm(
            `Make ${user.username} an administrator?`
        );

        if (!confirmed) {
            return;
        }

        setPendingUserId(user.id);
        setError("");
        setSuccess("");

        try {
            const updatedUser = await promoteUserToAdmin(
                token,
                user.id
            );

            setUsers((currentUsers) =>
                currentUsers.map((currentUser) =>
                    currentUser.id === updatedUser.id
                        ? updatedUser
                        : currentUser
                )
            );

            setSuccess(
                `${updatedUser.username} is now an administrator.`
            );
        } catch (requestError) {
            handleRequestError(requestError);
        } finally {
            setPendingUserId("");
        }
    }

    async function handleDelete(user) {
        const confirmed = window.confirm(
            `Permanently delete ${user.username}?`
        );

        if (!confirmed) {
            return;
        }

        setPendingUserId(user.id);
        setError("");
        setSuccess("");

        try {
            const response = await deleteUser(token, user.id);

            setUsers((currentUsers) =>
                currentUsers.filter(
                    (currentUser) =>
                        currentUser.id !== user.id
                )
            );

            setSuccess(response.message);
        } catch (requestError) {
            handleRequestError(requestError);
        } finally {
            setPendingUserId("");
        }
    }

    function handleRequestError(requestError) {
        if (requestError.status === 401) {
            setError(
                "Your session is missing, invalid, or expired."
            );
        } else if (requestError.status === 403) {
            setError(
                "You do not have permission to manage users."
            );
        } else {
            setError(
                requestError.message ||
                "The request could not be completed."
            );
        }
    }

    return (
        <section className="card dashboard admin-dashboard">
            <div className="panel-heading">
                <div>
                    <h2>Administrator Dashboard</h2>

                    <p>
                        Signed in as{" "}
                        <strong>{username}</strong>
                    </p>
                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>
            </div>

            <div className="dashboard-section">
                <div className="users-heading">
                    <h3>User Management</h3>

                    <button
                        type="button"
                        onClick={loadUsers}
                        disabled={loading}
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <p>Loading users...</p>
                ) : users.length === 0 ? (
                    <p>No users were found.</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => {
                                    const isCurrentUser =
                                        user.username === username;

                                    const isPending =
                                        pendingUserId === user.id;

                                    return (
                                        <tr key={user.id}>
                                            <td>
                                                {user.username}

                                                {isCurrentUser && (
                                                    <span className="you-label">
                                                        You
                                                    </span>
                                                )}
                                            </td>

                                            <td>{user.role}</td>

                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handlePromote(user)
                                                        }
                                                        disabled={
                                                            isPending ||
                                                            user.role === "ADMIN"
                                                        }
                                                    >
                                                        {user.role === "ADMIN"
                                                            ? "Administrator"
                                                            : "Make Admin"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="danger-button"
                                                        onClick={() =>
                                                            handleDelete(user)
                                                        }
                                                        disabled={
                                                            isPending ||
                                                            isCurrentUser
                                                        }
                                                    >
                                                        {isPending
                                                            ? "Working..."
                                                            : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {success && (
                    <p className="success-message">
                        {success}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}
            </div>
        </section>
    );
}

export default AdminDashboard;