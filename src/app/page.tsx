import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || 'JWT_TOKEN');
  const isAuthenticated = !!token;
  if (isAuthenticated) {
    // If authenticated, go to the study selector to ensure a study is chosen
    redirect('/study-selector');
  } else {
    // If not, go to login
    redirect('/login');
  }
}
