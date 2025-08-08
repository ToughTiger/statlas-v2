
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  const subjects = [
    { id: "SUBJ-001", status: "Enrolled", age: 45, gender: "Male", arm: "Drug A" },
    { id: "SUBJ-002", status: "Completed", age: 52, gender: "Female", arm: "Placebo" },
    { id: "SUBJ-003", status: "Screening", age: 38, gender: "Male", arm: "Drug B" },
    { id: "SUBJ-004", status: "Enrolled", age: 61, gender: "Female", arm: "Drug A" },
    { id: "SUBJ-005", status: "Withdrawn", age: 49, gender: "Male", arm: "Placebo" },
    { id: "SUBJ-006", status: "Enrolled", age: 55, gender: "Female", arm: "Drug B" },
    { id: "SUBJ-007", status: "Completed", age: 42, gender: "Male", arm: "Drug A" },
  ];

  const subjectDetails = {
    'SUBJ-001': {
        id: 'SUBJ-001',
        demographics: { age: 45, gender: 'Male', race: 'Caucasian', ethnicity: 'Non-Hispanic' },
        vitals: {
            current: { heartRate: '72 bpm', bloodPressure: '120/80 mmHg', temperature: '98.6°F', respiratoryRate: '16 breaths/min' },
            history: [
                { visit: 'Screening', heartRate: 75, bloodPressure: 122, temperature: 98.5 },
                { visit: 'Week 1', heartRate: 70, bloodPressure: 118, temperature: 98.7 },
                { visit: 'Week 4', heartRate: 72, bloodPressure: 120, temperature: 98.6 },
                { visit: 'Week 8', heartRate: 74, bloodPressure: 125, temperature: 98.8 },
            ],
        },
        labs: {
            current: { wbc: '6.5 x 10^9/L', rbc: '4.8 x 10^12/L', hemoglobin: '15 g/dL', glucose: '90 mg/dL' },
            history: [
                { visit: 'Screening', wbc: 6.2, rbc: 4.7, hemoglobin: 14.8, glucose: 88 },
                { visit: 'Week 4', wbc: 6.5, rbc: 4.8, hemoglobin: 15, glucose: 90 },
                { visit: 'Week 8', wbc: 6.8, rbc: 4.9, hemoglobin: 15.2, glucose: 95 },
            ]
        },
        treatment: { arm: 'Drug A', dosage: '100mg', startDate: '2023-05-12', status: 'Active' },
    },
    // Add other subject details here...
  };
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (id) {
    // @ts-ignore
    const subject = subjectDetails[id] || subjects.find(s => s.id === id);
     if (subject) {
        return NextResponse.json(subject);
     }
     return new Response('Subject not found', { status: 404 });
  }

  return NextResponse.json(subjects);
}
