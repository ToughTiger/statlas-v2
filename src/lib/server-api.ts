import 'server-only';
import { fetchWithAuth as serverFetchWithAuth } from './server-auth';
import {
  ApiResponse,
  Site,
  Study,
  Subject,
  SubjectDetailsData,
} from '@/types';

// This file contains API calls that are intended to be made from the SERVER-SIDE.
// It uses the server-side fetchWithAuth which reads cookies from the request headers.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';


export async function getStudies(userId: string | undefined): Promise<Study[]> {
    if (!userId) return [];
    const response = await serverFetchWithAuth(`${API_BASE_URL}/studies/${userId}`, {
        method: 'POST',
    });
    if (!response?.data || !Array.isArray(response.data)) {
        console.error('Invalid response from getStudies:', response);
        return [];
    }
    // Map API response to our application's Study type
    return response.data.map((study: any) => ({
        id: study.study_id.toString(),
        name: study.study_name,
    }));
}


export async function setStudyNameOnServer(studyId: string, studyName: string | null) {
    if (!studyName) {
        throw new Error("Study name cannot be null.");
    }
    // This function will now be responsible for calling the dbname endpoint
    // AND setting the cookie for the selected study.
    // The server-auth file handles cookie setting.
    await serverFetchWithAuth(`${API_BASE_URL}/dbname/${studyName}`, {
        method: 'POST',
    });
    return;
}

export async function getAllSites(): Promise<Site[]> {
    const response = await serverFetchWithAuth(`${API_BASE_URL}/all_sites`,{
        method: 'GET',
    });
    if (!response?.data || !Array.isArray(response.data)) {
        console.error('Invalid response from getAllSites:', response);
        return [];
    }
    return response.data.map((site: any) => ({
        id: site.SiteID,
        name: site.HospitalName,
    }));
}

export async function getSubjects(siteIds: string[] | null): Promise<Subject[]> {
    const siteIdsString = siteIds ? siteIds.join(',') : '';
    const query = siteIdsString ? `?site_ids=${encodeURIComponent(siteIdsString)}` : '';
    
    const response = await serverFetchWithAuth(`${API_BASE_URL}/subjects${query}`,{
      method: 'POST',
    });

    if (!response?.data || !Array.isArray(response.data)) {
        console.error('Invalid response from getSubjects:', response);
        return [];
    }
    
    return response.data;
}

export async function getSubjectDetails(subjectId: string): Promise<ApiResponse<SubjectDetailsData>> {
    const url = `${API_BASE_URL}/subject_details?subject_id=${encodeURIComponent(subjectId)}`;
    const response = await serverFetchWithAuth(url, {
        method: "GET",
    });
    return response;
}


// These are the individual stat fetching functions, now running on the server.
export async function getSubjectCount(): Promise<any> {
    const response =  await serverFetchWithAuth(`${API_BASE_URL}/subject_counts`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
       cache: 'no-store',
    });
    if (!response) throw new Error("Failed to fetch subject counts");
    return response;
};

export async function getEnrollmentCount(): Promise<any> {
  const response =  await serverFetchWithAuth(`${API_BASE_URL}/enrollment_counts`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      cache: 'no-store',
  });
  if (!response) throw new Error("Failed to fetch enrollment counts");
    return response;
}

export async function getWithdrawnCount(): Promise<any> {
  const response =  await serverFetchWithAuth(`${API_BASE_URL}/withdrawn_counts`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      cache: 'no-store',
  });
  if (!response) throw new Error("Failed to fetch withdrawn counts");
  return response;
}

export async function getCompletedCount(): Promise<any> {
  const response =  await serverFetchWithAuth(`${API_BASE_URL}/completed_counts`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      cache: 'no-store',
  });
  if (!response) throw new Error("Failed to fetch completed counts");
  return response;
}

export async function getScreeningCount(): Promise<any> {
  const response =  await serverFetchWithAuth(`${API_BASE_URL}/screening_counts`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
     cache: 'no-store',
  });
  if (!response) throw new Error("Failed to fetch screening counts");
   return response;
}
