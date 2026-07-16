import { useNavigate } from "react-router-dom";

function UserDashboard({ username }) {
    const navigate = useNavigate();

    return (
        <section className="card dashboard">
            <h2>User Dashboard</h2>

            <p>
                Welcome, <strong>{username}</strong>.
            </p>

            <p>You successfully accessed the protected user endpoint.</p>

            <button
                type="button"
                onClick={() => navigate("/")}
            >
                Back to Home
            </button>
        </section>
    );
}

export default UserDashboard;