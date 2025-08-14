// app/api/set-study/route.js
import { fetchWithAuthServer} from '@/lib/server-auth';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function POST(req: Request) {
  const { studyId, studyName } = await req.json();

  if (!studyId || !studyName) {
    return NextResponse.json({ detail: 'studyId and studyName are required' }, { status: 400 });
  }

  const apiResponse = await fetchWithAuthServer(`${API_BASE_URL}/dbname/${studyName}`, {
    method: "POST",
  });

  if (!apiResponse) {
      return NextResponse.json({ detail: 'study selection failed' }, { status: 500 });
  }

  // Set the token in a secure, httpOnly cookie
  const maxAge = 60 * 60 * 24; // 24 hours
  const response = NextResponse.json({ message: 'Study selection successful' }, { status: 200 });
  
  response.cookies.set('Selected-Study', studyId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: maxAge,
  });

  response.cookies.set('Selected-Study-Name', studyName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAge,
});

  // Return a success response to the client
  return response;  
}
