import { createStore } from 'zustand';
import { useToast } from '@/hooks/use-toast';
import { getDashboardInsight } from '@/ai/flows/dashboard-insights-flow';
import { getPrediction } from '@/ai/flows/predictive-analysis-flow';
import EnrollmentChart from '@/components/dashboard/charts/enrollment-chart';
import GenderDistributionChart from '@/components/dashboard/charts/gender-distribution-chart';
import AdverseEventsChart from '@/components/dashboard/charts/adverse-events-chart';
import SitePerformanceChart from '@/components/dashboard/charts/site-performance-chart';
import type { PredictionInput } from '@/ai/flows/predictive-analysis-flow';
import { getAllSites, getSubjects } from '@/lib/api';
import type { Subject } from '@/types';


const allCharts = [
  { id: 'enrollment', component: EnrollmentChart, title: 'Enrollment Over Time' },
  { id: 'gender', component: GenderDistributionChart, title: 'Gender Distribution' },
  { id: 'adverse', component: AdverseEventsChart, title: 'Adverse Events by Arm' },
  { id: 'site', component: SitePerformanceChart, title: 'Site Performance' },
];

export type SelectOption = { label: string; value: string };

export type DashboardLayout = {
  id: string;
  name: string;
  qualitative: {
    charts: { id: string; component: React.ComponentType<{ data: any[] }>; title: string }[];
  };
  statistical: {
    operations: string[];
  };
  predictive: {
    type: string;
  };
};

export type Filters = {
  sites: string[];
  visits: string[];
  forms: string[];
  fields: string[];
  lovs: string[];
  operations: string[];
};

export interface DashboardState {
  // State
  layouts: DashboardLayout[];
  activeLayout: DashboardLayout | null;
  activeTab: string;
  filters: Filters;
  chartsData: { [key: string]: any[] };
  statisticalChartsData: { [key: string]: any };
  isLoading: boolean;
  isFetchingNewData: boolean;
  isModalOpen: boolean;
  currentInsight: string;
  currentTitle: string;
  isLoadingInsight: boolean;
  currentPrediction: string;
  isLoadingPrediction: boolean;
  predictionType: string;
  subjects: Subject[];
  isLoadingSubjects: boolean;
  
  // Filter options
  siteOptions: SelectOption[];
  visitOptions: SelectOption[];
  formOptions: SelectOption[];
  fieldOptions: SelectOption[];
  lovOptions: SelectOption[];

  // Actions
  fetchLayouts: () => Promise<void>;
  selectLayout: (layoutId: string) => void;
  saveLayout: (name: string) => Promise<void>;
  setChartLayout: (charts: any[]) => void;
  setActiveTab: (tab: string) => void;
  applyFilters: (newFilters: Filters) => void;
  fetchQualitativeCharts: () => Promise<void>;
  fetchStatisticalCharts: () => Promise<void>;
  generateInsight: (chartId: string, chartTitle: string, chartData: any) => Promise<void>;
  generatePrediction: (input: PredictionInput) => Promise<void>;
  openModal: () => void;
  closeModal: () => void;
  setPredictionType: (type: string) => void;
  fetchSubjects: () => Promise<void>;
  fetchFilterOptions: () => Promise<void>;
}

const createDefaultLayout = (): DashboardLayout => ({
    id: 'default',
    name: 'Default View',
    qualitative: {
        charts: allCharts,
    },
    statistical: {
        operations: [],
    },
    predictive: {
        type: 'site-enrollment'
    }
});


export const createDashboardStore = () => createStore<DashboardState>((set, get) => ({
  // Initial State
  layouts: [],
  activeLayout: null,
  activeTab: "qualitative",
  filters: { sites: [], visits: [], forms: [], fields: [], lovs: [], operations: [] },
  chartsData: {},
  statisticalChartsData: {},
  isLoading: true,
  isFetchingNewData: false,
  isModalOpen: false,
  currentInsight: '',
  currentTitle: '',
  isLoadingInsight: false,
  currentPrediction: '',
  isLoadingPrediction: false,
  predictionType: 'site-enrollment',
  subjects: [],
  isLoadingSubjects: true,
  siteOptions: [],
  visitOptions: [],
  formOptions: [],
  fieldOptions: [],
  lovOptions: [],

  // Actions
  fetchLayouts: async () => {
    set({ isLoading: true });
    try {
      // Using a client-side API route for this
      const response = await fetch('/api/dashboards');
      if (!response.ok) throw new Error('Failed to fetch layouts');
      const data = await response.json();
      const mappedData: DashboardLayout[] = data.map((layout: any) => ({
        id: layout.id,
        name: layout.name,
        qualitative: {
            charts: layout.qualitative.charts.map((chartId: string) => allCharts.find(c => c.id === chartId)).filter(Boolean)
        },
        statistical: layout.statistical,
        predictive: layout.predictive
      }));
      set({ layouts: mappedData, activeLayout: createDefaultLayout() });
    } catch (error) {
      console.error("Failed to fetch dashboard layouts:", error);
       useToast().toast({ variant: "destructive", title: "Error", description: "Failed to load dashboard layouts."});
       set({ activeLayout: createDefaultLayout() });
    } finally {
      set({ isLoading: false });
    }
  },

  selectLayout: (layoutId: string) => {
    const { layouts, filters } = get();
    if (layoutId === 'default') {
      set({ 
          activeLayout: createDefaultLayout(),
          filters: { ...filters, operations: [] },
          predictionType: 'site-enrollment'
      });
      return;
    }
    const selected = layouts.find(l => l.id === layoutId);
    if (selected) {
      set({ 
          activeLayout: selected,
          filters: { ...filters, operations: selected.statistical.operations },
          predictionType: selected.predictive.type
      });
    }
  },

  saveLayout: async (name: string) => {
    const { activeLayout, filters, predictionType } = get();
    if (!activeLayout) return;

    const newLayoutData = {
      id: `custom-${Date.now()}`,
      name,
      qualitative: {
        charts: activeLayout.qualitative.charts.map(c => c.id),
      },
      statistical: {
        operations: filters.operations,
      },
      predictive: {
        type: predictionType,
      },
    };
    
    try {
      const response = await fetch('/api/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLayoutData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const savedLayouts = await response.json();
      const mappedData = savedLayouts.map((layout: any) => ({
        id: layout.id,
        name: layout.name,
        qualitative: {
            charts: layout.qualitative.charts.map((chartId: string) => allCharts.find(c => c.id === chartId)).filter(Boolean)
        },
        statistical: layout.statistical,
        predictive: layout.predictive
      }));
      set({ layouts: mappedData });
      const newActiveLayout = mappedData.find((l: DashboardLayout) => l.id === newLayoutData.id);
      if (newActiveLayout) {
        set({ activeLayout: newActiveLayout });
      }
    } catch (error: any) {
      console.error("Failed to save dashboard layout:", error);
      useToast().toast({ variant: "destructive", title: "Error Saving Layout", description: error.message });
    }
  },

  setChartLayout: (charts: any[]) => {
    set(state => {
      if (!state.activeLayout) return {};
      const newActiveLayout = {
        ...state.activeLayout,
        qualitative: {
            ...state.activeLayout.qualitative,
            charts: charts
        }
      };
      return { activeLayout: newActiveLayout };
    });
  },
  
  setActiveTab: (tab: string) => set({ activeTab: tab }),

  applyFilters: (newFilters: Filters) => {
    set({ filters: newFilters, isFetchingNewData: true });
    get().fetchSubjects();
    setTimeout(() => {
        set({ isFetchingNewData: false, activeTab: "statistical" });
    }, 1500); // Simulate fetch
  },
  
  fetchQualitativeCharts: async () => {
    const { activeLayout } = get();
    if (!activeLayout?.qualitative.charts.length) return;

    try {
        const dataPromises = activeLayout.qualitative.charts.map(chart =>
            fetch(`/api/charts/${chart.id}`).then(res => res.json())
        );
        const allData = await Promise.all(dataPromises);
        const newChartsData = activeLayout.qualitative.charts.reduce((acc, chart, index) => {
            acc[chart.id] = allData[index];
            return acc;
        }, {} as {[key: string]: any[]});
        set({ chartsData: newChartsData });
    } catch (error) {
        console.error("Failed to fetch qualitative chart data:", error);
    }
  },

  fetchStatisticalCharts: async () => {
    const { filters } = get();
    const selectedOperations = filters.operations || [];
    if (selectedOperations.length === 0) return;
    try {
        const dataPromises = selectedOperations.map((op: string) =>
            fetch(`/api/statistical-charts/${op}`).then(res => res.json()).catch(() => null)
        );
        const allData = await Promise.all(dataPromises);
        const newChartsData = selectedOperations.reduce((acc: any, op: string, index: number) => {
            acc[op] = allData[index];
            return acc;
        }, {});
        set({ statisticalChartsData: newChartsData });
    } catch (error) {
        console.error("Failed to fetch statistical chart data:", error);
    }
  },

  generateInsight: async (chartId: string, chartTitle: string, chartData: any) => {
    if (!chartData) {
        useToast().toast({
            variant: "destructive",
            title: "Error",
            description: "Chart data is not available for insight generation.",
        });
        return;
    }
    set({ currentTitle: chartTitle, isLoadingInsight: true, isModalOpen: true, currentInsight: '' });

    try {
        const result = await getDashboardInsight({
            title: chartTitle,
            data: JSON.stringify(chartData),
        });
        set({ currentInsight: result.insight });
    } catch (error: any) {
        console.error("Failed to generate insight:", error);
        const description = error.message.includes("GEMINI_API_KEY")
            ? "Your GEMINI_API_KEY is not configured. Please add it to your .env file."
            : "Could not generate AI insight. Please try again later.";
        useToast().toast({
            variant: "destructive",
            title: "Error",
            description: description,
        });
        set({ isModalOpen: false });
    } finally {
        set({ isLoadingInsight: false });
    }
  },
  
  generatePrediction: async (input: PredictionInput) => {
    set({ isLoadingPrediction: true, currentPrediction: '' });
    try {
        const result = await getPrediction(input);
        set({ currentPrediction: result.prediction });
    } catch (error: any) {
        console.error("Failed to generate prediction:", error);
        const description = error.message.includes("GEMINI_API_KEY")
            ? "Your GEMINI_API_KEY is not configured. Please add it to your .env file."
            : "Could not generate prediction. Please try again later.";
        useToast().toast({
            variant: "destructive",
            title: "Error",
            description: description,
        });
    } finally {
        set({ isLoadingPrediction: false });
    }
  },

  fetchSubjects: async () => {
    set({ isLoadingSubjects: true });
    try {
      const { filters } = get();
      const siteIds = filters.sites.length > 0 ? filters.sites : null;
      const subjectData = await getSubjects(siteIds); // This now calls the client-side API route
      set({ subjects: subjectData, isLoadingSubjects: false });
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      set({ subjects: [], isLoadingSubjects: false });
    }
  },
  
  fetchFilterOptions: async () => {
    try {
        // This is a client-side call
        const sites = await getAllSites();
        const siteOptions = sites.map(site => ({ label: site.name, value: site.id }));
        set({ siteOptions });
        // In a real app, you would fetch other filter options too
        // For now, we'll keep them as static placeholders
    } catch (error) {
        console.error("Failed to fetch filter options:", error);
    }
  },

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false, currentTitle: '', currentInsight: '' }),
  setPredictionType: (type: string) => set({ predictionType: type }),
}));
