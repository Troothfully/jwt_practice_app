import { useState } from "react";
import {
    Navigate,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";

import LoginForm from "./components/LoginForm";
import PublicPanel from "./components/PublicPanel";
import ProtectedPanel from "./components/ProtectedPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import RegisterForm from "./components/RegisterForm";

import "./App.css";

function App() {
    const [token, setToken] = useState(
        () => localStorage.getItem("jwtToken") || ""
    );

    const [username, setUsername] = useState(
        () => localStorage.getItem("username") || ""
    );

    const [authMode, setAuthMode] = useState("login");

    const navigate = useNavigate();

    function handleLogin(newToken, loggedInUsername) {
        localStorage.setItem("jwtToken", newToken);
        localStorage.setItem("username", loggedInUsername);

        setToken(newToken);
        setUsername(loggedInUsername);
    }

    function handleLogout() {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("username");

        setToken("");
        setUsername("");

        navigate("/");
    }

    const homePage = (
        <>
            <header className="page-header">
                <h1>Spring Boot JWT Client</h1>

                <p>
                    React frontend for the Spring Security API
                </p>
            </header>

            <div className="content-grid">
                <PublicPanel />

                {!token ? (
    <div>
        <div className="auth-tabs">
            <button
                type="button"
                className={
                    authMode === "login"
                        ? "auth-tab active-tab"
                        : "auth-tab"
                }
                onClick={() => setAuthMode("login")}
            >
                Login
            </button>

            <button
                type="button"
                className={
                    authMode === "register"
                        ? "auth-tab active-tab"
                        : "auth-tab"
                }
                onClick={() =>
                    setAuthMode("register")
                }
            >
                Create Account
            </button>
        </div>

        {authMode === "login" ? (
            <LoginForm onLogin={handleLogin} />
        ) : (
            <RegisterForm
                onRegistrationComplete={() =>
                    setAuthMode("login")
                }
            />
        )}
    </div>
) : (
    <ProtectedPanel
        token={token}
        username={username}
        onLogout={handleLogout}
    />
)}

            </div>
        </>
    );

    return (
        <main className="app-container">
            <Routes>
                <Route path="/" element={homePage} />

                <Route
                    path="/user-dashboard"
                    element={
                        <ProtectedRoute token={token}>
                            <UserDashboard username={username} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute token={token}>
                            <AdminDashboard username={username} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </main>
    );
}

export default App;