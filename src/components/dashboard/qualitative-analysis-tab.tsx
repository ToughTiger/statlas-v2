
"use client";

import React, { useState, useEffect } from 'react';
import StatCards from '@/components/dashboard/stat-cards';
import { SubjectsTable } from '@/components/dashboard/subjects-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';
import GenerateInsightButton from './generate-insight-button';
import InsightModal from './insight-modal';
import { useDashboardStore } from '@/store/dashboard-store-provider';
import { TabsContent } from '../ui/tabs';


export default function QualitativeAnalysisTab() {
  const { 
    activeLayout,
    setChartLayout,
    generateInsight,
    chartsData,
    fetchQualitativeCharts,
    isModalOpen,
    closeModal,
    currentInsight,
    currentTitle,
    isLoadingInsight
   } = useDashboardStore(state => ({
    activeLayout: state.activeLayout,
    setChartLayout: state.setChartLayout,
    generateInsight: state.generateInsight,
    chartsData: state.chartsData,
    fetchQualitativeCharts: state.fetchQualitativeCharts,
    isModalOpen: state.isModalOpen,
    closeModal: state.closeModal,
    currentInsight: state.currentInsight,
    currentTitle: state.currentTitle,
    isLoadingInsight: state.isLoadingInsight,
   }));

  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    if (activeLayout?.qualitative.charts.length > 0) {
      fetchQualitativeCharts();
    }
  }, [activeLayout, fetchQualitativeCharts]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedItem === null || draggedItem === id) return;

    if (!activeLayout) return;

    const draggedIndex = activeLayout.qualitative.charts.findIndex(c => c.id === draggedItem);
    const targetIndex = activeLayout.qualitative.charts.findIndex(c => c.id === id);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newCharts = [...activeLayout.qualitative.charts];
      const [movedItem] = newCharts.splice(draggedIndex, 1);
      newCharts.splice(targetIndex, 0, movedItem);
      setChartLayout(newCharts);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };
  
  const handleGenerateInsight = async (chartId: string, chartTitle: string) => {
    const chartData = chartsData[chartId];
    generateInsight(chartId, chartTitle, chartData);
  }

  if (!activeLayout) return null;

  return (
    <>
    <TabsContent value="qualitative">
        <div className="flex flex-col gap-8 pt-6 transition-opacity duration-300">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-primary">Overall Trial Summary</h2>
            </div>
            <StatCards />
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                {activeLayout.qualitative.charts.map((chart) => {
                const ChartComponent = chart.component;
                const chartData = chartsData[chart.id];
                return (
                    <div
                    key={chart.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, chart.id)}
                    onDragOver={(e) => handleDragOver(e, chart.id)}
                    onDragEnd={handleDragEnd}
                    className={`transition-all ${draggedItem === chart.id ? 'opacity-50' : ''} group`}
                    >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-secondary">{chart.title}</CardTitle>
                        <div className='flex items-center'>
                            <GenerateInsightButton onClick={() => handleGenerateInsight(chart.id, chart.title)} />
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move group-hover:text-primary transition-colors" />
                        </div>
                        </CardHeader>
                        <CardContent>
                        <ChartComponent data={chartData} />
                        </CardContent>
                    </Card>
                    </div>
                );
                })}
            </div>
            <SubjectsTable />
        </div>
    </TabsContent>
    <InsightModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentTitle}
        insight={currentInsight}
        loading={isLoadingInsight}
    />
    </>
  );
}
