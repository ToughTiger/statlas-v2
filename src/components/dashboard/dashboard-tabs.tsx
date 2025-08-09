"use client";

import React, { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QualitativeAnalysisTab from '@/components/dashboard/qualitative-analysis-tab';
import StatisticalAnalysisTab from '@/components/dashboard/statistical-analysis-tab';
import PredictiveAnalysisTab from '@/components/dashboard/predictive-analysis-tab';
import LoadingSpinner from '@/components/dashboard/loading-spinner';
import { useDashboardStore } from '@/store/dashboard-store-provider';

export default function DashboardTabs() {
  const {
    activeTab,
    setActiveTab,
    isFetchingNewData,
    fetchLayouts,
    layouts,
    activeLayout,
    isLoading
  } = useDashboardStore((state) => ({
    activeTab: state.activeTab,
    setActiveTab: state.setActiveTab,
    isFetchingNewData: state.isFetchingNewData,
    fetchLayouts: state.fetchLayouts,
    layouts: state.layouts,
    activeLayout: state.activeLayout,
    isLoading: state.isLoading,
  }));

  useEffect(() => {
    fetchLayouts();
  }, [fetchLayouts]);

  if (isLoading || !activeLayout) {
    return <LoadingSpinner />;
  }
  
  return (
    <>
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
    </>
  );
}
