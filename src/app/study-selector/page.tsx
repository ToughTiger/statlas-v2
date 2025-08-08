
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
import { Study } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";


export default function StudySelectorPage() {
    const [studies, setStudies] = useState<Study[]>([]);
    const [selectedStudy, setSelectedStudy] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                // In a real app, you'd get the userId from an auth context
                const userId = 'user123'; 
                const fetchedStudies = await getStudies(userId);
                setStudies(fetchedStudies);
            } catch (error) {
                console.error("Failed to fetch studies", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudies();
    }, []);

    const handleProceed = async () => {
        if (selectedStudy) {
            try {
                await setStudyName(selectedStudy);
            } catch (error) {
                 console.error("Failed to set study name", error);
            }
        }
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
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="study">Study</Label>
                            {loading ? (
                                <Skeleton className="h-10 w-full" />
                            ) : (
                                <Select onValueChange={setSelectedStudy} disabled={studies.length === 0}>
                                    <SelectTrigger id="study">
                                        <SelectValue placeholder={studies.length > 0 ? "Select a study" : "No studies available"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {studies.map(study => (
                                            <SelectItem key={study.id} value={study.name}>
                                                {study.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <Button asChild className="w-full" onClick={handleProceed} disabled={!selectedStudy}>
                           <Link href="/dashboard">Proceed to Dashboard</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
