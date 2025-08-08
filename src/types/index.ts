

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
}

export interface JwtPayload {
  userid: number;
  username: string;
  EmailId: string;
  first_name: string;
  last_name: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Study {
  id: string; // Changed from study_id for consistency in the app
  name: string; // Changed from study_name
}

export interface DatabaseName { 
  message: string;
}

export interface Site {
  id: string; // Changed from SiteID
  name: string; // Changed from HospitalName
}

export interface Subject { 
  id: string; // Changed from SubjectId
  name: string; // Changed from SubjectName
  // These fields are required by the SubjectsTable, so we'll keep them
  status: string;
  age: number;
  gender: string;
  arm: string;
}

export interface Visit {
  id: string; // Changed from VisitID
  name: string; // Changed from VisitName
}

export interface Form {
  id: string; // Changed from PanelID
  name: string; // Changed from PanelName
}

export interface Field {
  id: string; // Changed from DyanamicAttributeID
  name: string;  // Changed from AttributeName
  attribute_id: string; // Keep this for LOV fetching
}

export interface LovValue {
  id: string; // Changed from AttributeID
  value: string; // Changed from DisplayText
}

export type OptionType = {
  label: string;
  value: string;
  icon?:React.ComponentType<{ className?: string }>;
};

export interface AnalysisData {
  [key: string]: any;
}

// Subject Details Page Types
export interface SubjectDetails {
    age: number;
    gender: string;
    race: string;
    ethnicity: string;
    heart_rate: string;
    blood_pressure: string;
    temperature: string;
    respiratory_rate: string;
    wbc: string;
    rbc: string;
    hemoglobin: string;
    glucose: string;
    arm: string;
    dosage: string;
    start_date: string;
    status: string;
}

export interface VitalsHistory {
    visit: string;
    heart_rate: number;
    blood_pressure: number;
}

export interface LabsHistory {
    visit: string;
    wbc: number;
    hemoglobin: number;
}

export interface SubjectDetailsData {
    subject_details: SubjectDetails;
    vitals_history: VitalsHistory[];
    labs_history: LabsHistory[];
}
