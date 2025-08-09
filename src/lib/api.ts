
'use client'; 

// This file contains API calls that are intended to be made from the client side.
// They use the client-side fetchWithAuth which relies on the browser's context.

import {fetchWithAuth} from '@/lib/authenticate'
import { 
  ApiResponse,
  Site,
  Subject,
  Visit,
  Form,
  Field,
  LovValue,
  AnalysisData,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function getAllSites(): Promise<Site[]> {
    // Note: This call is now done on the server in server-api.ts,
    // but we keep it here in case it's needed on the client.
    const response = await fetchWithAuth(`${API_BASE_URL}/all_sites`,{
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
    // This is a client-side call, so it uses a client-side route handler
    // to protect the actual API call which needs a server-side token.
    const response = await fetch(`/api/data/subjects?site_ids=${encodeURIComponent(siteIdsString)}`);

    if (!response.ok) {
        console.error('Failed to fetch subjects');
        return [];
    }
    const data = await response.json();
    
    if (!data || !Array.isArray(data)) {
        console.error('Invalid response from getSubjects:', data);
        return [];
    }
    
    return data.map((subject: any) => ({
        id: subject.SubjectId,
        name: subject.SubjectName,
        status: subject.status || "Enrolled",
        age: subject.age || 30,
        gender: subject.gender || "N/A",
        arm: subject.arm || "Placebo"
    }));
}

// These functions below are not currently used by the SSR-refactored app
// but are kept for potential future client-side needs.

export async function getVisits(subjectId?: string): Promise<Visit[]> {
  const params = new URLSearchParams();
  if (subjectId !== undefined) {
    params.append("subject_id", subjectId.toString());
  }

  const queryString = params.toString();
  const response = await fetchWithAuth(`${API_BASE_URL}/visits${queryString ? `?${queryString}` : ''}`, {
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
    const response = await fetchWithAuth(`${API_BASE_URL}/forms/${visitIds.join(',')}`,{
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
    const response = await fetchWithAuth(url,{
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
  const response =  await fetchWithAuth(`${API_BASE_URL}/lov/${AttributeID}`, {
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
    const response =  await fetchWithAuth(`${API_BASE_URL}/data/${uidsString}`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.data) throw new Error("No 'data' field in response");

    return response.data;
}
