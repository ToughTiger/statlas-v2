"use server";

import 'server-only';
import { NextResponse } from 'next/server';
import { fetchWithAuthServer, fetchWithAuthServer as serverFetchWithAuth } from './server-auth';
import {
  ApiResponse,
  Site,
  Study,
  Subject,
  SubjectDetailsData,
   Visit,
  Form,
  Field,
  LovValue,
  AnalysisData,
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


const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002";

export async function setStudyNameOnServer(studyId: string, studyName: string) {
    if (!studyName) {
        throw new Error("Study name cannot be null.");
    }
    const res = await serverFetchWithAuth(`${BASE_URL}/api/set-study`, {
         method: 'POST',
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ studyId, studyName }),
    });
   
    return res;
}

export async function getAllSites(): Promise<Site[]> {

  const baseUrl = typeof window === 'undefined'
        ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'
        : '';
    const response = await fetch(`${baseUrl}/api/sites`, { method: 'GET' });
    if (!response.ok) {
        console.error('Failed to fetch sites:', response.statusText);
        return [];
    }

    const sites = await response.json(); // Parse JSON body

     if (!Array.isArray(sites)) {
        console.error('Invalid response from getAllSites:', sites);
        return [];
    }
    console.log("Site data:", sites)
    // const data = response.json();
    return sites.map((site: any) => ({
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
    console.log("Subject data:", response.data)
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

export async function getVisits(subjectId?: string): Promise<Visit[]> {
  const params = new URLSearchParams();
  if (subjectId !== undefined) {
    params.append("subject_id", subjectId.toString());
  }

  const queryString = params.toString();
  const response = await serverFetchWithAuth(`${API_BASE_URL}/visits${queryString ? `?${queryString}` : ''}`, {
    method: 'GET',
  });

  if (!response?.data || !Array.isArray(response.data)) {
    console.error('Invalid response from getVisits:', response);
    return [];
  }
  return response.data.map((visit: any) => ({
    id: visit.VisitID.toString(),
    name: visit.VisitName,
  }));
}

export async function getForms(visitIds: string[]): Promise<Form[]> {
    const response = await serverFetchWithAuth(`${API_BASE_URL}/forms/${visitIds.join(',')}`,{
      method: 'POST',
    });
    if (!response?.data || !Array.isArray(response.data)) {
        console.error('Invalid response from getForms:', response);
        return [];
    }
    return response.data.map((form: any) => ({
        id: form.PanelID,
        name: form.PanelName,
    }));
}

export async function getFields(visitFormIds: string[], formId: string[]): Promise<Field[]> {
    const visitFormIdsParam = visitFormIds.join(',');
    const formIdsParam = formId.join(',');
    
    const url = `${API_BASE_URL}/fields/${visitFormIdsParam}/${formIdsParam}`;
    const response = await serverFetchWithAuth(url,{
      method: 'POST',
    });
 
    if (!response?.data || !Array.isArray(response.data)) {
        console.error('Invalid response from getFields:', response);
        return [];
    }
    return response.data.map((field: any) => ({
        id: field.DyanamicAttributeID,
        name: field.AttributeName,
        attribute_id: field.DyanamicAttributeID,
    }));
}

export async function getLovValues(AttributeID: string): Promise<LovValue[]> {
  const response =  await serverFetchWithAuth(`${API_BASE_URL}/lov/${AttributeID}`, {
    method: 'POST',
  });
  if (!response?.data || !Array.isArray(response.data)) {
    console.error('Invalid response from getLovValues:', response);
    return [];
  }
  return response.data.map((lov: any) => ({
    id: lov.AttributeID,
    value: lov.DisplayText,
  }));
}
  
export async function getAnalysisData(uids: string[]): Promise<AnalysisData[]> {
    const uidsString = uids.map(encodeURIComponent).join(',');
    const response =  await serverFetchWithAuth(`${API_BASE_URL}/data/${uidsString}`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.data) throw new Error("No 'data' field in response");

    return response.data;
}

