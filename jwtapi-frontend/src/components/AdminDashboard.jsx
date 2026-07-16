import { useNavigate } from "react-router-dom";

function AdminDashboard({ username }) {
    const navigate = useNavigate();

    return (
        <section className="card dashboard">
            <h2>Administrator Dashboard</h2>

            <p>
                Welcome, <strong>{username}</strong>.
            </p>

            <p>You successfully accessed the protected admin endpoint.</p>

            <div className="dashboard-section">
                <h3>Administrator Controls</h3>

                <p>
                    Administrative features can be added here, such as
                    viewing users, changing roles, or managing accounts.
                </p>
            </div>

            <button
                type="button"
                onClick={() => navigate("/")}
            >
                Back to Home
            </button>
        </section>
    );
}

export default AdminDashboard;