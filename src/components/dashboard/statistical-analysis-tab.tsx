
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo, useEffect } from 'react';
import TTestChart from './statistical-charts/t-test-chart';
import AnovaChart from './statistical-charts/anova-chart';
import ChiSquaredChart from './statistical-charts/chi-squared-chart';
import DistributionChart from './statistical-charts/distribution-chart';
import ScatterPlotChart from './statistical-charts/scatter-plot-chart';
import GenerateInsightButton from './generate-insight-button';
import InsightModal from './insight-modal';
import { useDashboardStore } from '@/store/dashboard-store-provider';
import { TabsContent } from '../ui/tabs';

const operationFriendlyNames: { [key: string]: string } = {
  't-test': 'T-Test Analysis',
  'anova': 'ANOVA Analysis',
  'chi-squared': 'Chi-Squared Test Analysis',
  'distribution': 'Distribution Analysis',
  'scatter-plot': 'Scatter Plot Analysis',
};

const operationChartComponents: { [key: string]: React.ComponentType<{ data: any }> } = {
    't-test': TTestChart,
    'anova': AnovaChart,
    'chi-squared': ChiSquaredChart,
    'distribution': DistributionChart,
    'scatter-plot': ScatterPlotChart,
};

export default function StatisticalAnalysisTab() {
  const {
    filters,
    statisticalChartsData,
    generateInsight,
    fetchStatisticalCharts,
    isModalOpen,
    closeModal,
    currentInsight,
    currentTitle,
    isLoadingInsight
  } = useDashboardStore(state => ({
    filters: state.filters,
    statisticalChartsData: state.statisticalChartsData,
    generateInsight: state.generateInsight,
    fetchStatisticalCharts: state.fetchStatisticalCharts,
    isModalOpen: state.isModalOpen,
    closeModal: state.closeModal,
    currentInsight: state.currentInsight,
    currentTitle: state.currentTitle,
    isLoadingInsight: state.isLoadingInsight,
  }));

  const hasFilters = useMemo(() => {
    return Object.values(filters).some(val => Array.isArray(val) && val.length > 0) && filters.operations?.length > 0;
  }, [filters]);
  
  const selectedOperations = useMemo(() => {
    return filters.operations || [];
  }, [filters]);

  useEffect(() => {
    if (hasFilters) {
      fetchStatisticalCharts();
    }
  }, [hasFilters, fetchStatisticalCharts]);


  const handleGenerateInsight = async (operationKey: string) => {
    const analysisTitle = operationFriendlyNames[operationKey];
    const chartData = statisticalChartsData[operationKey];
    generateInsight(operationKey, analysisTitle, chartData);
  }

  return (
    <>
    <TabsContent value="statistical">
      {!hasFilters ? (
          <div className="flex flex-col gap-8 pt-6">
            <div className="h-[400px] flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground text-center px-4 max-w-md">
                Please select filters and one or more statistical operations from the sidebar, then click 'Apply Filters' to generate and view statistical charts.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 pt-6 transition-opacity duration-300">
            {selectedOperations.map((operationKey: string) => {
                const ChartComponent = operationChartComponents[operationKey];
                const analysisTitle = operationFriendlyNames[operationKey];
                const chartData = statisticalChartsData[operationKey];

                if (!ChartComponent) return null;

                return (
                  <Card key={operationKey}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                          <CardTitle className="text-secondary">{analysisTitle}</CardTitle>
                          <CardDescription>
                          Displaying the results for the {analysisTitle.toLowerCase()}.
                          </CardDescription>
                      </div>
                      <GenerateInsightButton onClick={() => handleGenerateInsight(operationKey)} />
                    </CardHeader>
                    <CardContent>
                      <ChartComponent data={chartData} />
                    </CardContent>
                  </Card>
                )
            })}
          </div>
        )}
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
