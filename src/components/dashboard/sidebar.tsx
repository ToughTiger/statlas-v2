"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Filter } from "lucide-react";
import { MultiSelect } from "../ui/multi-select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useFilterStore } from "@/store/filter-store";
import { useLayoutStore } from "@/store/layout-store";

const operationOptions = [
  { label: "T-Test", value: "t-test" },
  { label: "ANOVA", value: "anova" },
  { label: "Chi-Squared Test", value: "chi-squared" },
  { label: "Distribution Analysis", value: "distribution" },
  { label: "Scatter Plot Analysis", value: "scatter-plot" },
];

export function AppSidebar() {
  const {
    selectedSiteId,
    selectedSubjectId,
    selectedVisitId,
    selectedFormId,
    selectedFieldId,
    siteOptions,
    subjectOptions,
    visitOptions,
    formOptions,
    fieldOptions,
    setSelectedSiteId,
    setSelectedSubjectId,
    setSelectedVisitId,
    setSelectedFormId,
    setSelectedFieldId,
    fetchSites,
    fetchSubjects,
    fetchVisits,
    fetchForms,
    fetchFields,
  } = useFilterStore();

  const { activeTab } = useLayoutStore();

  // Load initial site list
  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  // Cascade: Site → Subjects
  useEffect(() => {
    if (selectedSiteId) {
      fetchSubjects(selectedSiteId);
    }
  }, [selectedSiteId, fetchSubjects]);

  // Cascade: Subject → Visits
  useEffect(() => {
    if (selectedSubjectId) {
      fetchVisits(selectedSubjectId);
    }
  }, [selectedSubjectId, fetchVisits]);

  // Cascade: Visit → Forms
  useEffect(() => {
    if (selectedVisitId) {
      fetchForms(selectedVisitId);
    }
  }, [selectedVisitId, fetchForms]);

  // Cascade: Form → Fields (pass visitId + formId)
  useEffect(() => {
    if (selectedVisitId && selectedFormId) {
      fetchFields(selectedVisitId, selectedFormId);
    }
  }, [selectedVisitId, selectedFormId, fetchFields]);

  const handleReset = () => {
    setSelectedSiteId(null);
    setSelectedSubjectId(null);
    setSelectedVisitId(null);
    setSelectedFormId(null);
    setSelectedFieldId(null);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/20 bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 flex-col items-start">
        <div className="text-2xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
          Statles
        </div>
        <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          by eric solutions
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={activeTab === "overview"}>
              <Link href="/dashboard">
                <LayoutGrid />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Filter size={16} /> Filters
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4 pt-2 group-data-[collapsible=icon]:hidden">
            <MultiSelect
              options={siteOptions}
              onValueChange={(val) => setSelectedSiteId(val[0] || null)}
              defaultValue={selectedSiteId ? [selectedSiteId] : []}
              placeholder="Select Site"
            />
            <MultiSelect
              options={subjectOptions}
              onValueChange={(val) => setSelectedSubjectId(val[0] || null)}
              defaultValue={selectedSubjectId ? [selectedSubjectId] : []}
              placeholder="Select Subject"
            />
            <MultiSelect
              options={visitOptions}
              onValueChange={(val) => setSelectedVisitId(val[0] || null)}
              defaultValue={selectedVisitId ? [selectedVisitId] : []}
              placeholder="Select Visit"
            />
            <MultiSelect
              options={formOptions}
              onValueChange={(val) => setSelectedFormId(val[0] || null)}
              defaultValue={selectedFormId ? [selectedFormId] : []}
              placeholder="Select Form"
            />
            <MultiSelect
              options={fieldOptions}
              onValueChange={(val) => setSelectedFieldId(val[0] || null)}
              defaultValue={selectedFieldId ? [selectedFieldId] : []}
              placeholder="Select Field"
            />
            <MultiSelect
              options={operationOptions}
              onValueChange={() => {}}
              defaultValue={[]}
              placeholder="Select Operation"
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden flex-col items-stretch gap-4 p-4">
        <Button variant="default" className="w-full" size="lg">
          <Filter className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
        <Button variant="outline" className="w-full" size="lg" onClick={handleReset}>
          Reset Filters
        </Button>
        <div className="border-t border-sidebar-border pt-4">
          <Button variant="ghost" className="w-full justify-start gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40.png" alt="@user" />
              <AvatarFallback>N</AvatarFallback>
            </Avatar>
            <span className="text-sidebar-foreground">User</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
