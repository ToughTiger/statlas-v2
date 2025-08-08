
import { NextResponse } from 'next/server';

// This is a mock API route. In a real application, you would fetch from a database.
// We are keeping this mock to ensure the SubjectsTable continues to function
// while the new `lib/api.ts` is being integrated.
// The new `getSubjects` in `lib/api.ts` will eventually be the source of truth.

const mockSubjects = [
    { id: 'SUBJ-001', status: 'Enrolled', age: 34, gender: 'Female', arm: 'Drug A' },
    { id: 'SUBJ-002', status: 'Completed', age: 45, gender: 'Male', arm: 'Placebo' },
    { id: 'SUBJ-003', status: 'Enrolled', age: 29, gender: 'Male', arm: 'Drug B' },
    { id: 'SUBJ-004', status: 'Withdrawn', age: 51, gender: 'Female', arm: 'Drug A' },
    { id: 'SUBJ-005', status: 'Enrolled', age: 38, gender: 'Male', arm: 'Placebo' },
    { id: 'SUBJ-006', status: 'Enrolled', age: 42, gender: 'Female', arm: 'Drug B' },
    { id: 'SUBJ-007', status: 'Completed', age: 55, gender: 'Male', arm: 'Drug A' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const siteIds = searchParams.get('site_ids');

  // In a real scenario, you'd use siteIds to filter from a database.
  // For now, we'll just return the whole mock list.
  // The presence of `siteIds` can be used for logging or future implementation.
  if (siteIds) {
      console.log(`Fetching subjects for site IDs: ${siteIds}`);
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json(mockSubjects);
}
