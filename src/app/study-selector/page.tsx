
"use client"

import Link from "next/link"
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


export default function StudySelectorPage() {
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
                            <Select defaultValue="study1">
                                <SelectTrigger id="study">
                                    <SelectValue placeholder="Select a study" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="study1">Oncology Trial TX-45B</SelectItem>
                                    <SelectItem value="study2">Cardiology Phase II Trial CV-08A</SelectItem>
                                    <SelectItem value="study3">Neurology Study ND-22C</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button asChild className="w-full">
                           <Link href="/dashboard">Proceed to Dashboard</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
