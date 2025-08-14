
"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Wand2 } from "lucide-react";
import { useDashboardStore } from '@/store/dashboard-store-provider';
import { TabsContent } from '../ui/tabs';
import { useToast } from '@/hooks/use-toast';

const predictionTypes = [
  { value: "site-enrollment", label: "Site Enrollment Prediction" },
  { value: "adverse-event", label: "Adverse Event Risk Prediction" },
];

export default function PredictiveAnalysisTab() {
    const { toast } = useToast();
    const { 
        generatePrediction, 
        currentPrediction, 
        isLoadingPrediction,
        predictionType,
        setPredictionType
    } = useDashboardStore(state => ({
        generatePrediction: state.generatePrediction,
        currentPrediction: state.currentPrediction,
        isLoadingPrediction: state.isLoadingPrediction,
        predictionType: state.predictionType,
        setPredictionType: state.setPredictionType,
    }));

    const [parameters, setParameters] = useState({
        country: 'USA',
        investigatorExperience: 'High',
        patientPopulation: 'Urban',
    });

    const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setParameters({
            ...parameters,
            [e.target.id]: e.target.value
        });
    };

    const handleSelectChange = (value: string) => {
        setPredictionType(value);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
      try {
            await generatePrediction({
                type: predictionType,
                parameters: JSON.stringify(parameters)
            });
        } catch (error: any) {
             const description = error.message.includes("GEMINI_API_KEY")
                ? "Your GEMINI_API_KEY is not configured. Please add it to your .env file."
                : "Could not generate prediction. Please try again later.";
            toast({
                variant: "destructive",
                title: "Error",
                description: description,
            });
        }
    };
    
    // Effect to update local state when active layout changes
    useEffect(() => {
        // You can also expand this to set parameters based on loaded layout if needed
    }, [predictionType]);


    return (
        <TabsContent value="predictive">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-secondary">Run Prediction</CardTitle>
                        <CardDescription>
                            Select a prediction model and provide the necessary parameters to generate a forecast.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="prediction-type">Prediction Model</Label>
                                <Select onValueChange={handleSelectChange} value={predictionType}>
                                    <SelectTrigger id="prediction-type">
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {predictionTypes.map(type => (
                                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {predictionType === 'site-enrollment' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input id="country" value={parameters.country} onChange={handleParameterChange} placeholder="e.g., USA" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="investigatorExperience">Investigator Experience</Label>
                                        <Select onValueChange={(val) => setParameters({...parameters, investigatorExperience: val})} defaultValue={parameters.investigatorExperience}>
                                            <SelectTrigger id="investigatorExperience">
                                                <SelectValue placeholder="Select experience level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="patientPopulation">Patient Population Density</Label>
                                         <Select onValueChange={(val) => setParameters({...parameters, patientPopulation: val})} defaultValue={parameters.patientPopulation}>
                                            <SelectTrigger id="patientPopulation">
                                                <SelectValue placeholder="Select population density" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Urban">Urban</SelectItem>
                                                <SelectItem value="Suburban">Suburban</SelectItem>
                                                <SelectItem value="Rural">Rural</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isLoadingPrediction}>
                                {isLoadingPrediction ? (
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Wand2 className="mr-2 h-4 w-4" />
                                )}
                                Generate Prediction
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-secondary">Prediction Result</CardTitle>
                        <CardDescription>
                            The AI-generated forecast will appear below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        {isLoadingPrediction ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <Textarea
                                readOnly
                                value={currentPrediction || "Your prediction will be displayed here..."}
                                className="h-full resize-none text-base"
                                rows={10}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
