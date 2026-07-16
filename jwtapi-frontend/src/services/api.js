const API_BASE_URL = "http://localhost:8080";

export async function getPublicMessage() {
    const response = await fetch(`${API_BASE_URL}/hello`);

    return handleResponse(response);
}

export async function login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    return handleResponse(response);
}

export async function register(username, password) {
    const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        }
    );

    return handleResponse(response);
}

export async function getAdminMessage(token) {
    const response = await fetch(`${API_BASE_URL}/admin`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response);
}

export async function getUserMessage(token) {
    const response = await fetch(`${API_BASE_URL}/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response);
}



async function handleResponse(response) {
    let data;

    try {
        data = await response.json();
    } catch {
        data = {
            message: "The server returned an invalid response.",
        };
    }

    if (!response.ok) {
        const error = new Error(
            data.message || "The request failed."
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}