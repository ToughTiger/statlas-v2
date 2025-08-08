
"use client"

import Link from "next/link"
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getStudies, setStudyName } from "@/lib/api";
import { getCurrentUser, setSelectedStudy as setLocalStudy } from "@/lib/authenticate";
import { Study } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


export default function StudySelectorPage() {
    const [studies, setStudies] = useState<Study[]>([]);
    const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const currentUser = getCurrentUser();
                if (!currentUser) {
                    toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
                    router.push('/login');
                    return;
                }
                const userId = currentUser?.id;
                const fetchedStudies = await getStudies(userId);
                setStudies(fetchedStudies);
            } catch (error: any) {
                console.error("Failed to fetch studies", error);
                toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to fetch studies.' });
            } finally {
                setLoading(false);
            }
        };
        fetchStudies();
    }, [toast, router]);

    const handleProceed = async () => {
        if (selectedStudy) {
            try {
                // This sets the DB context on the backend
                await setStudyName(selectedStudy.name); 
                // This saves the selection in localStorage for the client
                setLocalStudy(selectedStudy.id);
                router.push('/dashboard');
            } catch (error: any) {
                 console.error("Failed to set study name", error);
                 toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to select study.' });
            }
        }
    }
    
    const handleValueChange = (studyId: string) => {
        const study = studies.find(s => s.id === studyId);
        setSelectedStudy(study || null);
    };

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
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="study">Study</Label>
                            {loading ? (
                                <Skeleton className="h-10 w-full" />
                            ) : (
                                <Select onValueChange={handleValueChange} disabled={studies.length === 0}>
                                    <SelectTrigger id="study">
                                        <SelectValue placeholder={studies.length > 0 ? "Select a study" : "No studies available"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {studies.map(study => (
                                            <SelectItem key={study.id} value={study.id}>
                                                {study.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <Button onClick={handleProceed} className="w-full" disabled={!selectedStudy || loading}>
                           Proceed to Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
