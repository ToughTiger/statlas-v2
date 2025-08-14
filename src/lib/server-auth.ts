
"use server";
import 'server-only';
import { cookies } from 'next/headers';
import { decodeJwt } from '@/app/utils/jwt';
import { User, JwtPayload, Study } from '@/types';
import { use } from 'react';

const AUTH_TOKEN_KEY = process.env.AUTH_COOKIE_NAME || 'JWT_TOKEN';
const SELECTED_STUDY_KEY = 'Selected-Study';
const SELECTED_STUDY_NAME_KEY = 'Selected-Study-Name';

// This is the server-side fetchWithAuth. It reads cookies from the request headers.
export async function fetchWithAuthServer(url: string, options: RequestInit = {}) {
  const cookieStore =  await Promise.resolve(cookies());
  const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json');
  }

  // Include cookies in the request to the backend
  const requestCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  if (requestCookies) {
      headers.append('Cookie', requestCookies);
  }
  // console.log("headers", headers);
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
// console.log("response", response);
  if (!response.ok) {
    // Attempt to get more detailed error from response body
    const errorBody = await response.text();
    // console.error(`API request failed with status: ${response.status}`, { url, errorBody });
    throw new Error(`API request failed: ${response.statusText} - ${errorBody}`);
  }

  // Handle empty response body
  const text = await response.text();
  if (!text) {
    return {};
  }
  
  return JSON.parse(text);
}


// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// export async function fetchWithAuthServer(path: string, options: RequestInit = {}) {
//   // Determine absolute URL
//   const isAbsolute = /^https?:\/\//i.test(path);
//   const url = isAbsolute ? path : `${API_BASE_URL}${path}`;

//   // Prepare headers
//   const cookieStore = await Promise.resolve(cookies());
//   const token = cookieStore.get(process.env.AUTH_TOKEN_KEY || "auth_token")?.value;
//   const headers = new Headers(options.headers || {});

//   if (token && !headers.has("Authorization")) {
//     headers.append("Authorization", `Bearer ${token}`);
//   }
//   if (!headers.has("Content-Type")) {
//     headers.append("Content-Type", "application/json");
//   }

//   // Include cookies from server side
//   const requestCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");
//   if (requestCookies) {
//     headers.append("Cookie", requestCookies);
//   }

//   // Perform fetch
//   const response = await fetch(url, {
//     ...options,
//     headers,
//     credentials: "include",
//   });

//   if (!response.ok) {
//     const errorBody = await response.text();
//     throw new Error(`API request failed: ${response.statusText} - ${errorBody}`);
//   }

//   const text = await response.text();
//   return text ? JSON.parse(text) : {};
// }


// Utility to get user from cookie
export async function getUserFromCookie(): Promise<User | null> {
    const cookieStore =  await Promise.resolve(cookies());
    const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded: JwtPayload = decodeJwt(token);
        if (!decoded) {
            return null;
        }
        return {
            id: decoded.userid.toString(),
            username: decoded.username,
            email: decoded.EmailId,
            firstName: decoded.first_name,
            lastName: decoded.last_name,
            name: `${decoded.first_name} ${decoded.last_name}`,
        };
    } catch (error) {
        console.error("Failed to decode JWT or map user from cookie:", error);
        return null;
    }
}

// Utility to get selected study from cookie
export async function getSelectedStudyFromCookie(): Promise<Study | null> {
    const cookieStore =  await Promise.resolve(cookies());
    const studyId = cookieStore.get(SELECTED_STUDY_KEY)?.value;
    const studyName = cookieStore.get(SELECTED_STUDY_NAME_KEY)?.value;

    if (studyId && studyName) {
        return { id: studyId, name: studyName };
    }
    return null;
}
