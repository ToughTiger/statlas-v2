
"use client";

import React, { useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QualitativeAnalysisTab from '@/components/dashboard/qualitative-analysis-tab';
import StatisticalAnalysisTab from '@/components/dashboard/statistical-analysis-tab';
import PredictiveAnalysisTab from '@/components/dashboard/predictive-analysis-tab';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import LoadingSpinner from '@/components/dashboard/loading-spinner';
import { useDashboardStore } from '@/store/dashboard-store';

export default function DashboardPage() {
  const {
    activeTab,
    setActiveTab,
    isFetchingNewData,
    fetchLayouts,
    layouts,
    activeLayout
  } = useDashboardStore((state) => ({
    activeTab: state.activeTab,
    setActiveTab: state.setActiveTab,
    isFetchingNewData: state.isFetchingNewData,
    fetchLayouts: state.fetchLayouts,
    layouts: state.layouts,
    activeLayout: state.activeLayout,
  }));

  useEffect(() => {
    fetchLayouts();
  }, [fetchLayouts]);

  if (!activeLayout) {
    return <LoadingSpinner />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col w-full">
          <Header />
          <main id="dashboard-content" className="flex flex-1 flex-col gap-8 p-4 md:p-8 relative">
            <div className="flex items-center justify-between space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                {activeLayout.name}
              </h1>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="relative">
                 <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="qualitative">Qualitative Analysis</TabsTrigger>
                    <TabsTrigger value="statistical">Statistical Analysis</TabsTrigger>
                    <TabsTrigger value="predictive">Predictive Analysis</TabsTrigger>
                 </TabsList>
                 {isFetchingNewData && <LoadingSpinner />}
                 <div className={isFetchingNewData ? 'opacity-20' : ''}>
                    <QualitativeAnalysisTab />
                    <StatisticalAnalysisTab />
                    <PredictiveAnalysisTab />
                </div>
            </Tabs>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
