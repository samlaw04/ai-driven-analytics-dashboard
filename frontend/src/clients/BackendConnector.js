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

export const getDynamicPricingAccountSummary = async (customerId, startDate, endDate) => {
    const response = await fetch(`${BASE_URL}/dynamic-pricing/account-summary`, {
        method: 'GET',
        headers: {
            'Customer-Id': customerId,
            'Start-Date': startDate,
            'End-Date': endDate,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch DP account summary with status: ${response.status}`);
    }

    return response.json();
};

export const getDemandResponseAccountSummary = async (customerId, startDate, endDate) => {
    const response = await fetch(`${BASE_URL}/demand-response/account-summary`, {
        method: 'GET',
        headers: {
            'Customer-Id': customerId,
            'Start-Date': startDate,
            'End-Date': endDate,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch DR account summary with status: ${response.status}`);
    }
    return response.json();
};

export const getDynamicPricingRewards = async (customerId, startDate, endDate) => {
    const response = await fetch(`${BASE_URL}/dynamic-pricing/rewards`, {
        method: 'GET',
        headers: {
            'Customer-Id': customerId,
            'Start-Date': startDate,
            'End-Date': endDate,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch DP rewards with status: ${response.status}`);
    }

    return response.json();
};

export const getDemandResponseRewards = async (customerId, startDate, endDate) => {
    const response = await fetch(`${BASE_URL}/demand-response/rewards`, {
        method: 'GET',
        headers: {
            'Customer-Id': customerId,
            'Start-Date': startDate,
            'End-Date': endDate,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch DR rewards with status: ${response.status}`);
    }

    return response.json();
};

export const getProgramDetails = async (utilityId) => {
    const response = await fetch(`${BASE_URL}/utility/program-details`, {
        method: 'GET',
        headers: {
            'Utility-Id': utilityId,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch program details with status: ${response.status}`);
    }
    return response.json();
};

export const getUpcomingDrEvent = async (customerId) => {
    const response = await fetch(`${BASE_URL}/demand-response/upcoming-event`, {
        method: 'GET',
        headers: {
            'Customer-Id': customerId,
        },
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch upcoming DR event with status: ${response.status}`);
    }

    return response.json();
};

export const getCurrentSchedule = async (customerId) => {
    const response = await fetch(`${BASE_URL}/schedule/current`, {
        method: 'GET',
        headers: {
            'Customer-Id': customerId,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch current schedule with status: ${response.status}`);
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

