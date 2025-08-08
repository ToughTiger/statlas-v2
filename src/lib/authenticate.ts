
'use client'; // This file can be used in client components

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('jwt_token');

    const headers = new Headers(options.headers || {});
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }
    
    // Ensure credentials are included for cross-origin requests if needed
    const newOptions: RequestInit = {
        ...options,
        headers,
        credentials: 'include' 
    };

    try {
        const response = await fetch(url, newOptions);
        const data = await response.json();

        if (!response.ok) {
            // Throw an error with the message from the API if available
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data; // The API response should have a standard structure { success, data, message }
    } catch (error) {
        console.error('Fetch error:', error);
        // You might want to re-throw the error or handle it in a specific way
        throw error;
    }
}

// Example of how you might log in and get a token
export async function login(credentials: any) {
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(credentials)
    // });
    // const data = await response.json();
    // if (data.token) {
    //     localStorage.setItem('jwt_token', data.token);
    // }
    // For now, let's use a dummy token
    localStorage.setItem('jwt_token', 'your-dummy-jwt-token');
}

export function logout() {
    localStorage.removeItem('jwt_token');
}
