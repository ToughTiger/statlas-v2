
import 'server-only';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';
import { decodeJwt } from '@/app/utils/jwt';
import { User, JwtPayload, Study, ApiResponse } from '@/types';

const AUTH_TOKEN_KEY = 'JWT_TOKEN';
const SELECTED_STUDY_KEY = 'Selected-Study';
const SELECTED_STUDY_NAME_KEY = 'Selected-Study-Name';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// This is the server-side fetchWithAuth. It reads cookies from the request headers.
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json');
  }

  // Include cookies in the request to the backend
  const requestCookies = Object.entries(cookieStore.getAll()).map(([name, cookie]) => `${name}=${cookie.value}`).join('; ');
  if (requestCookies) {
      headers.append('Cookie', requestCookies);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Attempt to get more detailed error from response body
    const errorBody = await response.text();
    console.error(`API request failed with status: ${response.status}`, { url, errorBody });
    throw new Error(`API request failed: ${response.statusText} - ${errorBody}`);
  }

  // Handle empty response body
  const text = await response.text();
  if (!text) {
    return {};
  }
  
  return JSON.parse(text);
}

// Utility to get auth status from cookies
export async function getAuthStatus() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;
  return { isAuthenticated: !!token, token };
}

// Utility to get user from cookie
export async function getUserFromCookie(): Promise<User | null> {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;

    if (!token) return null;

    const decoded = decodeJwt(token) as JwtPayload | null;
    if (!decoded) return null;

    return {
        id: decoded.userid.toString(),
        username: decoded.username,
        name: `${decoded.first_name} ${decoded.last_name}`,
        email: decoded.EmailId,
        firstName: decoded.first_name,
        lastName: decoded.last_name,
    };
}


// Utility to get selected study from cookie
export async function getSelectedStudyFromCookie(): Promise<string | null> {
    const cookieStore = cookies();
    return cookieStore.get(SELECTED_STUDY_KEY)?.value || null;
}

// These functions handle setting cookies from Server Actions
export async function setAuthCookie(token: string, maxAge: number) {
    cookies().set(AUTH_TOKEN_KEY, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: maxAge,
    });
}

export async function setSelectedStudyCookie(studyId: string, studyName: string) {
    cookies().set(SELECTED_STUDY_KEY, studyId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
    cookies().set(SELECTED_STUDY_NAME_KEY, studyName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
}


export async function clearAuthCookies() {
    cookies().delete(AUTH_TOKEN_KEY);
    cookies().delete(SELECTED_STUDY_KEY);
    cookies().delete(SELECTED_STUDY_NAME_KEY);
}
