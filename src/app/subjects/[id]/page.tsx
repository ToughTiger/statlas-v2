
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, HeartPulse, TestTube, Pill } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { getSubjectDetails } from '@/lib/api';

export default function SubjectDetailPage({ params }: { params: { id: string } }) {
  const subjectId = params.id;
  const [subjectData, setSubjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subjectId) {
      const fetchSubjectData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getSubjectDetails(subjectId);
           if (!response.success) {
            throw new Error(response.message || 'Subject not found');
          }
          setSubjectData(response.data);
        } catch (err: any) {
          console.error("Failed to fetch subject data:", err);
          setError(err.message || "An unexpected error occurred.");
          setSubjectData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchSubjectData();
    }
  }, [subjectId]);

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-pulse">
        <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-7 w-1/3" />
        </div>
         <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card><CardHeader><Skeleton className="h-5 w-2/3 mb-2" /></CardHeader><CardContent><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-2/3 mb-2" /></CardHeader><CardContent><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-2/3 mb-2" /></CardHeader><CardContent><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-2/3 mb-2" /></CardHeader><CardContent><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[350px] w-full" />
        </div>
      </main>
    )
  }

  if (error) {
     return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center">
            <Card className="p-8 text-center">
                <CardTitle className="text-2xl text-destructive">Subject Not Found</CardTitle>
                <CardContent className="mt-4">
                    <p>The subject with ID "{subjectId}" could not be found.</p>
                    <Button asChild className="mt-4">
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
     )
  }

  if (!subjectData) {
    return null; // Should not happen if not loading and no error, but good practice
  }

  const { subject_details, vitals_history, labs_history } = subjectData;

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
              <p><strong>Age:</strong> {subject_details.age}</p>
              <p><strong>Gender:</strong> {subject_details.gender}</p>
              <p><strong>Race:</strong> {subject_details.race}</p>
              <p><strong>Ethnicity:</strong> {subject_details.ethnicity}</p>
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
              <p><strong>Heart Rate:</strong> {subject_details.heart_rate}</p>
              <p><strong>Blood Pressure:</strong> {subject_details.blood_pressure}</p>
              <p><strong>Temperature:</strong> {subject_details.temperature}</p>
              <p><strong>Resp. Rate:</strong> {subject_details.respiratory_rate}</p>
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
              <p><strong>WBC:</strong> {subject_details.wbc}</p>
              <p><strong>RBC:</strong> {subject_details.rbc}</p>
              <p><strong>Hemoglobin:</strong> {subject_details.hemoglobin}</p>
              <p><strong>Glucose:</strong> {subject_details.glucose}</p>
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
              <p><strong>Arm:</strong> {subject_details.arm}</p>
              <p><strong>Dosage:</strong> {subject_details.dosage}</p>
              <p><strong>Start Date:</strong> {subject_details.start_date}</p>
              <p><strong>Status:</strong> {subject_details.status}</p>
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
                    <LineChart height={300} data={vitals_history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="visit" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="heart_rate" stroke="hsl(var(--chart-1))" name="Heart Rate" />
                        <Line yAxisId="right" type="monotone" dataKey="blood_pressure" stroke="hsl(var(--chart-2))" name="Blood Pressure (Systolic)" />
                    </LineChart>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-secondary">Lab Results Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <LineChart height={300} data={labs_history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="visit" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="wbc" stroke="hsl(var(--chart-4))" name="WBC" />
                        <Line yAxisId="right" type="monotone" dataKey="hemoglobin" stroke="hsl(var(--chart-5))" name="Hemoglobin" />
                    </LineChart>
                </CardContent>
            </Card>
       </div>

       <div className="flex justify-start">
        <Button asChild variant="default">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
