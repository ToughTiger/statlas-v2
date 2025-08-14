
import { NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
        return NextResponse.json({ detail: 'Username and password are required' }, { status: 400 });
    }

    // Prepare the data in the format the backend expects
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    // Proxy the request to the actual backend
    const apiResponse = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
        ,
    });

    if (!apiResponse.ok) {
        // If the backend returned an error, forward it to the client
        const errorData = await apiResponse.json().catch(() => ({ detail: 'An unknown error occurred' }));
        return NextResponse.json(errorData, { status: apiResponse.status });
    }

    // Extract the token from the backend response
    const { access_token, token_type } = await apiResponse.json();

    if (!access_token) {
        return NextResponse.json({ detail: 'Login failed: No access token received from backend' }, { status: 500 });
    }

    // Set the token in a secure, httpOnly cookie
    const maxAge = 60 * 60 * 24; // 24 hours
    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
     response.cookies.set(process.env.AUTH_COOKIE_NAME || 'JWT_TOKEN', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: maxAge,
    });
    // Return a success response to the client
    return response;

  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}
