

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
  id: string; 
  name: string;
}

export interface DatabaseName { 
  message: string;
}

export interface Site {
  id: string;
  name: string;
}

export interface Subject { 
  id: string;
  status: string;
  age: number;
  gender: string;
  arm: string;
}

export interface Visit {
  id: string;
  name: string;
}

export interface Form {
  id: string;
  name: string;
}

export interface Field {
  id: string;
  name: string;
  attribute_id: string;
}

export interface LovValue {
  id: string;
  value: string;
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
    age: number | null;
    gender: string | null;
    race: string | null;
    ethnicity: string | null;
    heart_rate: string | null;
    blood_pressure: string | null;
    temperature: string | null;
    respiratory_rate: string | null;
    wbc: string | null;
    rbc: string | null;
    hemoglobin: string | null;
    glucose: string | null;
    arm: string | null;
    dosage: string | null;
    start_date: string | null;
    status: string | null;
}

export interface VitalsHistory {
    visit: string;
    heart_rate: number | null;
    blood_pressure: number | null;
}

export interface LabsHistory {
    visit: string;
    wbc: number | null;
    hemoglobin: number | null;
}

export interface SubjectDetailsData {
    subject_details: SubjectDetails;
    vitals_history: VitalsHistory[];
    labs_history: LabsHistory[];
}
