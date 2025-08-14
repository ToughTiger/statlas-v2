
'use client';

// This file handles CLIENT-SIDE authentication logic.
// It is responsible for making API calls to log in/out,
// but does not handle tokens directly. Token management is
// done via secure, httpOnly cookies handled by the server.

const LOGIN_API_URL = '/api/auth/login';
const LOGOUT_API_URL = '/api/auth/logout';
export async function login(username: string, password: string): Promise<boolean> {
  
  const response = await fetch(LOGIN_API_URL, {
    method: 'POST',
    headers: {
       'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Login failed due to a network or server error.' }));
    throw new Error(errorData.detail || 'Invalid username or password.');
  }

  return response.ok;
}

export async function logout(): Promise<void> {
  try {
    await fetch(LOGOUT_API_URL, { method: 'POST' });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    // Redirect to login after attempting to log out, regardless of success
    window.location.href = '/login';
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
     const response = await fetch('/api/auth/status'); 
    if (!response.ok) return false;
    const data = await response.json();
    return data.isAuthenticated === true;
  } catch (error) {
    console.error("Auth status check failed:", error);
    return false;
  }
}


// This function is kept for client-side API calls that might still be needed.
// It will automatically include cookies.
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `API request failed with status: ${response.status}`);
  }

  // Handle cases where the response might be empty
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}
