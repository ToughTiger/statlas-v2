
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface Study {
    id: string;
    name: string;
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

export interface AnalysisData {
    // Define structure based on what your API returns
    [key: string]: any;
}

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

export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface DatabaseName {
    // Define based on what your /dbname API returns
    [key: string]: any;
}
