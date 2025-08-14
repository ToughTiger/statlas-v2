
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Study } from '@/types';

interface StudySelectorClientProps {
    studies: Study[];
    selectStudyAction: (studyId: string, studyName: string) => Promise<{ success: boolean; message?: string }>;
}

export default function StudySelectorClient({ studies, selectStudyAction }: StudySelectorClientProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [selectedStudyId, setSelectedStudyId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleProceed = async () => {
        if (!selectedStudyId) {
            toast({
                variant: "destructive",
                title: "No Study Selected",
                description: "Please select a study before proceeding.",
            });
            return;
        }
        
        setIsLoading(true);

        const selectedStudy = studies.find(s => s.id === selectedStudyId);
        if (!selectedStudy) return; // Should not happen

        const result = await selectStudyAction(selectedStudy.id, selectedStudy.name);
        
        if (result.success) {
            toast({
                variant: "default",
                title: "Success",
                description: "Successfully selected the study.",
            });
            router.push('/dashboard');
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.message || "Could not select the study. Please try again.",
            });
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="study">Study</Label>
                <Select value={selectedStudyId} onValueChange={setSelectedStudyId} disabled={studies.length === 0 || isLoading}>
                    <SelectTrigger id="study">
                        <SelectValue placeholder="Select a study" />
                    </SelectTrigger>
                    <SelectContent>
                        {studies.length > 0 ? (
                            studies.map((study, index) => (
                                <SelectItem key={index} value={study.id}>
                                    {study.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-studies" disabled>No studies available for your account.</SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleProceed} disabled={!selectedStudyId || isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Proceed to Dashboard
            </Button>
        </div>
    )
}

