import { getStudies, setStudyNameOnServer } from '@/lib/server-api';
import { getUserFromCookie, getSelectedStudyFromCookie } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import StudySelectorClient from './study-selector-client';

export default async function StudySelectorPage() {
    const selectedStudy = await getSelectedStudyFromCookie();
    
    // If a study is already selected in cookies, redirect to dashboard
    if (selectedStudy) {
        redirect('/dashboard');
    }

    const user = await getUserFromCookie();
    if (!user) {
        redirect('/login');
    }

    const studies = await getStudies(user.id);
    
    // This server action will be passed to the client component.
    // It runs on the server to set the cookie.
    async function selectStudyAction(studyId: string, studyName: string) {
        'use server';
        try {
            await setStudyNameOnServer(studyId, studyName);
        } catch (e) {
            console.error("Failed to set study in cookie", e);
            // Handle error appropriately
            return { success: false, message: "Failed to select study." };
        }
        // Instead of redirecting here, we let the client do it
        // to ensure a smooth transition.
        return { success: true };
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Select a Study</CardTitle>
                    <CardDescription>
                        Choose the clinical trial you want to view from the list of studies assigned to you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <StudySelectorClient studies={studies} selectStudyAction={selectStudyAction} />
                </CardContent>
            </Card>
        </div>
    )
}
