
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

export async function  getStudies(userId: string|undefined): Promise<Study[]> { 
    const response = await fetchWithAuth(`${API_BASE_URL}/studies/${userId}`, {
      method: 'POST',
    });
    if (!response?.data || !Array.isArray(response.data)) {
        console.error('Invalid response from getStudies:', response);
        return [];
    }
    return response.data;
}

export async function setStudyName(studyName: string |null) {
    if (!studyName) {
        throw new Error("Study name cannot be null.");
    }
    const response = await database(studyName);
    return response.data;
}

export async function getAllSites(): Promise<ApiResponse<Site[]>> {
    const response = await fetchWithAuth(`${API_BASE_URL}/all_sites`,{
        method: 'GET',
    });
    return response;
}

export async function getSiteDetails(siteIds: string): Promise<ApiResponse<Site[]>> {
    const response = await fetchWithAuth(`${API_BASE_URL}/site-details/${siteIds}`, {
        method: 'POST',
    });
    return response.data;
}

export async function getSubjects(siteIds: string | null): Promise<ApiResponse<Subject[]>> {
    const query = siteIds ? `?site_ids=${encodeURIComponent(siteIds)}` : '';
    
    const response = await fetchWithAuth(`${API_BASE_URL}/subjects${query}`,{
      method: 'POST',
    });
    return response;
}

export async function getVisits(subjectId?: string): Promise<ApiResponse<Visit[]>> {
    const params = new URLSearchParams();
    if (subjectId !== undefined) {
        params.append("subject_id", subjectId.toString());
    }

    const queryString = params.toString();
    const response = await fetchWithAuth(`${API_BASE_URL}/visits${queryString ? `?${queryString}` : ''}`, {
        method: 'GET',
    });
    return response;
}

export async function getForms(visitIds: string): Promise<ApiResponse<Form[]>> {
    const response = await fetchWithAuth(`${API_BASE_URL}/forms/${visitIds}`,{
      method: 'POST',
    });
    return response;
}

export async function getFields(visitFormIds: string | string[], formId: string | string[]): Promise<ApiResponse<Field[]>> {
    let visitFormIdsParam: string = '';
    let formIdsParam: string = '';

    if (Array.isArray(visitFormIds)) {
      if(visitFormIds.length > 0){
        visitFormIdsParam = visitFormIds.join(',');
      }else {
        console.warn("getFields received an empty array of visitFormIds.");
      }
    }else {
      visitFormIdsParam = visitFormIds
    }

    if (Array.isArray(formId)) {
      if(formId.length > 0){
        formIdsParam = formId.join(',');
      }else {
        console.warn("getFields received an empty array of formIds.");
      }
    }else {
      formIdsParam = formId
    }
    
    const url = `${API_BASE_URL}/fields/${visitFormIdsParam}/${formIdsParam}`;
    const response =await fetchWithAuth(url,{
    method: 'POST',
  });
 
  return response;
}

export async function getLovValues(AttributeID: string): Promise<ApiResponse<LovValue[]>> {
  const response =  await fetchWithAuth(`${API_BASE_URL}/lov/${AttributeID}`, {
    method: 'POST',
  });
  return response;
}

  
export async function getAnalysisData(uids: string[]): Promise<ApiResponse<AnalysisData[]>> {
    const uidsString = uids.map(encodeURIComponent).join(',');
    const response =  await fetchWithAuth(`${API_BASE_URL}/data/${uidsString}`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.data) throw new Error("No 'data' field in response");

    return response; 
}

export async function getSubjectDetails(subjectId: string): Promise<ApiResponse<SubjectDetailsData>> {
    const url = `${API_BASE_URL}/subject_details?subject_id=${encodeURIComponent(subjectId)}`;

    try {
        const response = await fetchWithAuth(url, {
            method: "GET",
        });

        if (!response || !response.data || !response.data.subject_details) {
            throw new Error("Invalid response from server");
        }
        return response;
    } catch (error) {
        console.error("Error fetching subject details:", error);
        throw error;
    }
}
