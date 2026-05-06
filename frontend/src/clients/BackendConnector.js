const BASE_URL = 'http://localhost:8080';

export const authenticateUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Invalid credentials');
    }

    return response.json();
};

export const getUserProfile = async (customerId) => {
    const response = await fetch(`${BASE_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
            'Customer-Id': customerId,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }

    return response.json();
};

export const getUtilityProgramDetails = async (utilityId) => {
    const response = await fetch(`${BASE_URL}/api/utility/program-details`, {
        method: 'GET',
        headers: {
            'Utility-Id': utilityId,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch utility program details');
    }

    return response.json();
};
