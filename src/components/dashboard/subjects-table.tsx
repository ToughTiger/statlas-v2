
"use client";

import Link from "next/link"
import { useRouter } from "next/navigation";
import { ArrowRight, Download } from "lucide-react"
import { useEffect } from "react";
import Papa from "papaparse";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "../ui/skeleton";
import { useDashboardStore } from "@/store/dashboard-store";

export function SubjectsTable() {
  const router = useRouter();
  const { subjects, isLoadingSubjects, fetchSubjects, filters } = useDashboardStore(state => ({
    subjects: state.subjects,
    isLoadingSubjects: state.isLoadingSubjects,
    fetchSubjects: state.fetchSubjects,
    filters: state.filters
  }));

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects, filters.sites]);

  const handleExport = () => {
    if (subjects) {
        const csv = Papa.unparse(subjects);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "subjects.csv");
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Enrolled":
        return "default";
      case "Completed":
        return "secondary";
      case "Withdrawn":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handlePrefetch = (subjectId: string) => {
    router.prefetch(`/subjects/${subjectId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-secondary">Subjects</CardTitle>
          <CardDescription>
            A list of all subjects in the clinical trial.
          </CardDescription>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm" disabled={!subjects || subjects.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Age</TableHead>
              <TableHead className="hidden md:table-cell">Gender</TableHead>
              <TableHead>Treatment Arm</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingSubjects ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[40px]" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-[70px]" /></TableCell>
                </TableRow>
              ))
            ) : (
              subjects && subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.id}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(subject.status) as any}>{subject.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{subject.age}</TableCell>
                  <TableCell className="hidden md:table-cell">{subject.gender}</TableCell>
                  <TableCell>{subject.arm}</TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/subjects/${subject.id}`} onMouseEnter={() => handlePrefetch(subject.id)}>
                          View
                          <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{isLoadingSubjects ? '...' : subjects?.length ?? 0}</strong> of <strong>{isLoadingSubjects ? '...' : subjects?.length ?? 0}</strong> subjects
        </div>
      </CardFooter>
    </Card>
  )
}
