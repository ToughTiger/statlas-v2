// app/api/set-study/route.js
import { fetchWithAuthServer} from '@/lib/server-auth';
import { NextResponse } from 'next/server';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
export async function POST(req: Request) {
  const { studyName } = await req.json();
  console.log("studyName", studyName);
  const apiResponse = await fetchWithAuthServer(`${API_BASE_URL}/dbname/${studyName}`, {
    method: "POST",
  });

  // const { study_name } = await apiResponse.json();
  // alert( study_name);

    if (!studyName) {
        return NextResponse.json({ detail: 'study sellection failed' }, { status: 500 });
    }

    // Set the token in a secure, httpOnly cookie
    const maxAge = 60 * 60 * 24; // 24 hours
    const response = NextResponse.json({ message: 'Study selection successful' }, { status: 200 });
     response.cookies.set(process.env.STUDY_COOKIE_NAME || 'SELECTED_STUDY', studyName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: maxAge,
    });
    // Return a success response to the client
    return response;  
}
