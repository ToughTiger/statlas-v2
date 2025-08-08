// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function getSubjectCount(): Promise<any> {
    const response =  await fetch(`${API_BASE_URL}/subject_counts`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
       cache: 'no-store',
    });
    if (!response.ok) throw new Error("Failed to fetch subject counts");
    return response.json();
};

export async function getEnrollmentCount(): Promise<any> {
  const response =  await fetch(`${API_BdirectionASE_URL}/enrollment_counts`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      cache: 'no-store',
  });
  if (!response.ok) throw new Error("Failed to fetch enrollment counts");
    return response.json();
}

export async function getWithdrawnCount(): Promise<any> {
  const response =  await fetch(`${API_BASE_URL}/withdrawn_counts`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      cache: 'no-store',
  });
  if (!response.ok) throw new Error("Failed to fetch withdrawn counts");
  return response.json();
}

export async function getCompletedCount(): Promise<any> {
  const response =  await fetch(`${API_BASE_URL}/completed_counts`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      cache: 'no-store',
  });
  if (!response.ok) throw new Error("Failed to fetch completed counts");
  return response.json();
}

export async function getScreeningCount(): Promise<any> {
  const response =  await fetch(`${API_BASE_URL}/screening_counts`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
     cache: 'no-store',
  });
  if (!response.ok) throw new Error("Failed to fetch screening counts");
   return response.json();
}
