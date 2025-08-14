
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        
        const cookieStore = await cookies();
        cookieStore.delete(process.env.AUTH_COOKIE_NAME || 'JWT_TOKEN');
        cookieStore.delete('Selected-Study');
        cookieStore.delete('Selected-Study-Name');

        const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
    }
}
