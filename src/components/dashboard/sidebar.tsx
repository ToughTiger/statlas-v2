
"use client"
import React, { useState, useEffect } from 'react';
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
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  LayoutGrid,
  Filter,
} from "lucide-react"
import { MultiSelect } from "../ui/multi-select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDashboardStore } from '@/store/dashboard-store-provider';

const operationOptions = [
    { label: 'T-Test', value: 't-test' },
    { label: 'ANOVA', value: 'anova' },
    { label: 'Chi-Squared Test', value: 'chi-squared' },
    { label: 'Distribution Analysis', value: 'distribution' },
    { label: 'Scatter Plot Analysis', value: 'scatter-plot' },
];

export function AppSidebar() {
    const { 
        applyFilters, 
        filters, 
        activeLayout,
        siteOptions,
        visitOptions,
        formOptions,
        fieldOptions,
        lovOptions,
        fetchFilterOptions
    } = useDashboardStore(state => ({
        applyFilters: state.applyFilters,
        filters: state.filters,
        activeLayout: state.activeLayout,
        siteOptions: state.siteOptions,
        visitOptions: state.visitOptions,
        formOptions: state.formOptions,
        fieldOptions: state.fieldOptions,
        lovOptions: state.lovOptions,
        fetchFilterOptions: state.fetchFilterOptions
    }));

    const [selectedSites, setSelectedSites] = useState<string[]>(filters.sites);
    const [selectedVisits, setSelectedVisits] = useState<string[]>(filters.visits);
    const [selectedForms, setSelectedForms] = useState<string[]>(filters.forms);
    const [selectedFields, setSelectedFields] = useState<string[]>(filters.fields);
    const [selectedLovs, setSelectedLovs] = useState<string[]>(filters.lovs);
    const [selectedOperations, setSelectedOperations] = useState<string[]>(filters.operations);

    useEffect(() => {
        fetchFilterOptions();
    }, [fetchFilterOptions]);
    
    useEffect(() => {
        if (activeLayout) {
            setSelectedOperations(activeLayout.statistical.operations || []);
        }
    }, [activeLayout]);


    const handleApply = () => {
        applyFilters({
            sites: selectedSites,
            visits: selectedVisits,
            forms: selectedForms,
            fields: selectedFields,
            lovs: selectedLovs,
            operations: selectedOperations,
        });
    };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/20 bg-sidebar text-sidebar-foreground">
        <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 flex-col items-start">
            <div className="text-2xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">Statles</div>
            <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">by eric solutions</div>
        </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
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
             
             <div>
                <MultiSelect options={siteOptions} onValueChange={setSelectedSites} defaultValue={selectedSites} placeholder="Select Sites" className="w-full" />
             </div>
              <div>
                <MultiSelect options={visitOptions} onValueChange={setSelectedVisits} defaultValue={selectedVisits} placeholder="Select Visits" className="w-full" />
             </div>
              <div>
                <MultiSelect options={formOptions} onValueChange={setSelectedForms} defaultValue={selectedForms} placeholder="Select Forms" className="w-full" />
             </div>
             <div>
                <MultiSelect options={fieldOptions} onValueChange={setSelectedFields} defaultValue={selectedFields} placeholder="Select Fields" className="w-full" />
             </div>
             <div>
                <MultiSelect options={lovOptions} onValueChange={setSelectedLovs} defaultValue={selectedLovs} placeholder="Select LOV" className="w-full" />
             </div>
             <div>
                <MultiSelect options={operationOptions} onValueChange={setSelectedOperations} defaultValue={selectedOperations} placeholder="Select Operation" className="w-full" />
             </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden flex-col items-stretch gap-4 p-4">
        <Button variant="default" className="w-full" size="lg" onClick={handleApply}>
            <Filter className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
         <div className="border-t border-sidebar-border pt-4">
             <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="@user" data-ai-hint="profile picture" />
                    <AvatarFallback>N</AvatarFallback>
                </Avatar>
                <span className="text-sidebar-foreground">User</span>
             </Button>
         </div>
      </SidebarFooter>
    </Sidebar>
  )
}
