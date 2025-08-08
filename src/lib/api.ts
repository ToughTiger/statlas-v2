
'use client'; 

import {fetchWithAuth, database} from '@/lib/authenticate'
import { 
  ApiResponse,
  Site,
  Study,
  Subject,
  Visit,
  Form,
  Field,
  LovValue,
  AnalysisData,
  SubjectDetailsData
 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function getStudies(userId: string | undefined): Promise<Study[]> {
    if (!userId) return [];
    const response = await fetchWithAuth(`${API_BASE_URL}/studies/${userId}`, {
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


export async function setStudyName(studyName: string |null) {
    if (!studyName) {
        throw new Error("Study name cannot be null.");
    }
    // The backend seems to expect the study name, not an ID.
    const response = await database(studyName);
    return response.data;
}

export async function getAllSites(): Promise<Site[]> {
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

export async function getSiteDetails(siteIds: string): Promise<Site[]> {
    const response = await fetchWithAuth(`${API_BASE_URL}/site-details/${siteIds}`, {
        method: 'POST',
    });
    return response.data;
}

export async function getSubjects(siteIds: string[] | null): Promise<Subject[]> {
    const siteIdsString = siteIds ? siteIds.join(',') : '';
    const query = siteIdsString ? `?site_ids=${encodeURIComponent(siteIdsString)}` : '';
    
    const response = await fetchWithAuth(`${API_BASE_URL}/subjects${query}`,{
      method: 'POST',
    });

    if (!response?.data || !Array.isArray(response.data)) {
        console.error('Invalid response from getSubjects:', response);
        return [];
    }
    
    // The subject data from the user has a different shape than what the table needs.
    // We will assume the API provides the necessary fields and map them.
    // This is a placeholder mapping and might need adjustment based on actual API response.
    return response.data.map((subject: any) => ({
        id: subject.SubjectId,
        name: subject.SubjectName, // Assuming SubjectName is available
        status: subject.status || "Enrolled", // Placeholder
        age: subject.age || 30, // Placeholder
        gender: subject.gender || "N/A", // Placeholder
        arm: subject.arm || "Placebo" // Placeholder
    }));
}

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
        attribute_id: field.DyanamicAttributeID, // Or another field if available
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
    id: lov.AttributeID, // This seems odd, maybe should be another unique ID
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

export async function getSubjectDetails(subjectId: string): Promise<ApiResponse<SubjectDetailsData>> {
    const url = `${API_BASE_URL}/subject_details?subject_id=${encodeURIComponent(subjectId)}`;

    try {
        const response = await fetchWithAuth(url, {
            method: "GET",
        });

        if (!response || !response.success || !response.data || !response.data.subject_details) {
            throw new Error(response.message || "Invalid response from server");
        }
        return response;
    } catch (error: any) {
        console.error("Error fetching subject details:", error);
        // Re-throw as a more structured object for the UI to handle
        return { success: false, data: {} as SubjectDetailsData, message: error.message };
    }
}
