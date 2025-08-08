
import { NextResponse } from 'next/server';
import { getSubjects, getSubjectDetails } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id');
  const siteIds = searchParams.get('site_ids');

  try {
    if (id) {
        const subjectDetails = await getSubjectDetails(id);
        return NextResponse.json(subjectDetails);
    } else {
        const subjectsResponse = await getSubjects(siteIds);
        return NextResponse.json(subjectsResponse.data);
    }
  } catch (error: any) {
    console.error(`Failed to fetch subjects:`, error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch data', details: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
}
