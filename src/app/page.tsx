import { redirect } from 'next/navigation';
import { getAuthStatus } from '@/lib/server-auth';

export default async function Home() {
  const { isAuthenticated } = await getAuthStatus();

  if (isAuthenticated) {
    // If authenticated, go to the study selector to ensure a study is chosen
    redirect('/study-selector');
  } else {
    // If not, go to login
    redirect('/login');
  }
}
