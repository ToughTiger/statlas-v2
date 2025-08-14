
import { NextResponse } from 'next/server';

import { getSubjects as getSubjectsFromServer } from '@/lib/server-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
const siteIdsParam = searchParams.get('site_ids');
  const siteIds = siteIdsParam ? siteIdsParam.split(',') : null;
  
  try {
    const subjects = await getSubjectsFromServer(siteIds);
    return NextResponse.json(subjects);
  } catch (error) {
    console.error(`Error fetching subjects from server:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
