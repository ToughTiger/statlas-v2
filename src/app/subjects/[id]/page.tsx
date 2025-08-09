import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, HeartPulse, TestTube, Pill } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getSubjectDetails } from '@/lib/server-api';
import { SubjectDetailsData, ApiResponse } from '@/types';

// This is now a Server Component, so data fetching is done here directly.
export default async function SubjectDetailPage({ params }: { params: { id: string } }) {
  const subjectId = params.id;
  
  let subjectData: SubjectDetailsData | null = null;

  try {
    // We call the server-side API function to get the data
    const response: ApiResponse<SubjectDetailsData> = await getSubjectDetails(subjectId);
    if (!response.success || !response.data || !response.data.subject_details) {
      // If the API call is successful but there's no data, trigger a 404
      notFound();
    }
    subjectData = response.data;
  } catch (err: any) {
    console.error("Failed to fetch subject data:", err);
    // If there's an API error (e.g., server down), we can also trigger a 404
    // or show a custom error page. notFound() is often sufficient.
    notFound();
  }

  // Destructure the data after we're sure it exists.
  const { subject_details, vitals_history, labs_history } = subjectData;
  const demographics = subject_details;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="h-8 w-8">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <div className='flex justify-between w-full items-center'>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                Subject Details: {subjectId}
            </h1>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary">Demographics</CardTitle>
            <User className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p><strong>Age:</strong> {demographics.age ?? 'N/A'}</p>
              <p><strong>Gender:</strong> {demographics.gender ?? 'N/A'}</p>
              <p><strong>Race:</strong> {demographics.race ?? 'N/A'}</p>
              <p><strong>Ethnicity:</strong> {demographics.ethnicity ?? 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary">Vitals</CardTitle>
            <HeartPulse className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-sm text-muted-foreground">
              <p><strong>Heart Rate:</strong> {demographics.heart_rate ?? 'N/A'} bpm</p>
              <p><strong>Blood Pressure:</strong> {demographics.blood_pressure ?? 'N/A'} mmHg</p>
              <p><strong>Temperature:</strong> {demographics.temperature ?? 'N/A'} °F</p>
              <p><strong>Resp. Rate:</strong> {demographics.respiratory_rate ?? 'N/A'} bpm</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary">Lab Results</CardTitle>
            <TestTube className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-sm text-muted-foreground">
              <p><strong>WBC:</strong> {demographics.wbc ?? 'N/A'} 10³/µL</p>
              <p><strong>RBC:</strong> {demographics.rbc ?? 'N/A'} 10⁶/µL</p>
              <p><strong>Hemoglobin:</strong> {demographics.hemoglobin ?? 'N/A'} g/dL</p>
              <p><strong>Glucose:</strong> {demographics.glucose ?? 'N/A'} mg/dL</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary">Treatment Info</CardTitle>
            <Pill className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-sm text-muted-foreground">
              <p><strong>Arm:</strong> {demographics.arm ?? 'N/A'}</p>
              <p><strong>Dosage:</strong> {demographics.dosage ?? 'N/A'}</p>
              <p><strong>Start Date:</strong> {demographics.start_date ?? 'N/A'}</p>
              <p><strong>Status:</strong> {demographics.status ?? 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 md:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-secondary">Vitals Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={vitals_history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="visit" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="heart_rate" stroke="hsl(var(--chart-1))" name="Heart Rate" />
                        <Line yAxisId="right" type="monotone" dataKey="blood_pressure" stroke="hsl(var(--chart-2))" name="Blood Pressure (Systolic)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-secondary">Lab Results Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={labs_history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="visit" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="wbc" stroke="hsl(var(--chart-4))" name="WBC" />
                        <Line yAxisId="right" type="monotone" dataKey="hemoglobin" stroke="hsl(var(--chart-5))" name="Hemoglobin" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
            </Card>
       </div>

       <div className="flex justify-start mt-4">
        <Button asChild variant="default">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
