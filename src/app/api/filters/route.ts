import { NextResponse } from 'next/server';
import { fetchWithAuthServer } from '@/lib/server-auth';
import type { Site } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// export async function GET() {
//   try {
//     const response = await fetchWithAuthServer(`${API_BASE_URL}/all_sites`,{
//         method: 'GET',
//     });

//     if (!response?.data || !Array.isArray(response.data)) {
//         console.error('Invalid response from getAllSites:', response);
//         return NextResponse.json([]);
//     }
    
//     const sites: Site[] = response.data.map((site: any) => ({
//         id: site.SiteID,
//         name: site.HospitalName,
//     }));
//     return NextResponse.json(sites);
//   } catch (error) {
//     console.error(`Error fetching sites from server:`, error);
//     if (error instanceof Error) {
//         return new NextResponse(JSON.stringify({ detail: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
//     }
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// }
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  switch (type) {
    case 'sites':
      return fetchWithAuthServer(`${API_BASE_URL}/all_sites`);
    case 'subjects':
      return fetchWithAuthServer(`${API_BASE_URL}/subjects?siteId=${id}`);
    case 'visits':
      return fetchWithAuthServer(`${API_BASE_URL}/visits`);
    case 'forms':
      return fetchWithAuthServer(`${API_BASE_URL}/forms?visitId=${id}`);
    case 'fields':
      return fetchWithAuthServer(`${API_BASE_URL}/fields?formId=${id}`);
    case 'lovs':
      return fetchWithAuthServer(`${API_BASE_URL}/lovs?fieldId=${id}`);
    default:
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
}