"use client"

import React, { useState } from 'react';
import {
  Bell,
  Download,
  Save,
} from "lucide-react"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "../ui/sidebar"
import { SaveDashboardDialog } from "./save-dashboard-dialog";
import { Skeleton } from "../ui/skeleton";
import { useDashboardStore } from '@/store/dashboard-store';


export function Header() {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { layouts, activeLayout, selectLayout, saveLayout, isLoading } = useDashboardStore((state) => ({
    layouts: state.layouts,
    activeLayout: state.activeLayout,
    selectLayout: state.selectLayout,
    saveLayout: state.saveLayout,
    isLoading: state.isLoading,
  }));

  const handleExport = (format: 'png' | 'pdf') => {
    const dashboard = document.getElementById('dashboard-content');
    if (dashboard) {
        html2canvas(dashboard, {
            useCORS: true,
            allowTaint: true,
            scale: 2, 
        }).then(canvas => {
            if (format === 'png') {
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'dashboard.png';
                link.href = image;
                link.click();
            } else if (format === 'pdf') {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('dashboard.pdf');
            }
        });
    }
  }


  return (
    <>
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-30">
        <SidebarTrigger className="md:hidden" />
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex items-center gap-2 sm:flex-initial">
          {isLoading ? (
            <Skeleton className="h-9 w-[200px]" />
          ) : (
             <Select value={activeLayout?.id} onValueChange={selectLayout}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Dashboard" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Default View</SelectItem>
                    {layouts.map(layout => (
                        <SelectItem key={layout.id} value={layout.id}>
                            {layout.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          )}

          <Button variant="outline" size="sm" className="h-9 gap-1" onClick={() => setIsSaveDialogOpen(true)}>
            <Save className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Save Dashboard
            </span>
          </Button>

         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Download className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('png')}>Save as PNG</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>Save as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
         <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
               <Avatar>
                <AvatarImage src="https://placehold.co/40x40.png" alt="@user" data-ai-hint="profile picture" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <SaveDashboardDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={saveLayout}
        existingLayoutCount={layouts.length}
    />
    </>
  )
}
