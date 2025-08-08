'use client';

import { User, DatabaseName, ApiResponse } from '@/types';
import { decodeJwt } from '@/app/utils/jwt';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
const AUTH_TOKEN_KEY = 'JWT_TOKEN'; // Key for storing JWT token in localStorage
const SELECTED_STUDY_KEY = 'Selected Study'; // Key for storing selected study in localStorage
const CURRENT_USER_KEY = 'Current User'; // Key for storing current user in localStorage

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function login(username: string, password: string): Promise<User | null> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('grant_type', 'password');

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const { access_token } = await response.json();
  if (!access_token) {
    console.error("Login failed: No access token received");
    return null;
  }

  const decodedUser = decodeJwt(access_token);
  const user = {
    id: decodedUser?.userid?.toString() || '',
    username: decodedUser?.username || '',
    name: `${decodedUser?.first_name || ''} ${decodedUser?.last_name || ''}`,
    email: decodedUser?.EmailId || '',
    firstName: decodedUser?.first_name || '',
    lastName: decodedUser?.last_name || '',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, access_token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  return user;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(SELECTED_STUDY_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = '/login';
  }
}

export async function database(databaseName: string): Promise<ApiResponse<DatabaseName>> {
  return fetchWithAuth(`${API_BASE_URL}/dbname/${databaseName}`, {
    method: 'POST',
  });
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error("Error parsing current user from localStorage", e);
    return null;
  }
}

export function setSelectedStudy(studyId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SELECTED_STUDY_KEY, studyId);
  }
}

export function getSelectedStudy(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SELECTED_STUDY_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
}