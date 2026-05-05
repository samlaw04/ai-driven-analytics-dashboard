const BASE_URL = '/api';

export const authenticateUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
    }

    return response.json();
};

export const getUserProfile = async (customerId) => {
    const response = await fetch(`${BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
            'Customer-Id': customerId,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch profile with status: ${response.status}`);
    }

    return response.json();
};

