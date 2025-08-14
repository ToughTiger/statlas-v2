

import { createStore } from 'zustand';
import { getDashboardInsight } from '@/ai/flows/dashboard-insights-flow';
import { getPrediction } from '@/ai/flows/predictive-analysis-flow';
import EnrollmentChart from '@/components/dashboard/charts/enrollment-chart';
import GenderDistributionChart from '@/components/dashboard/charts/gender-distribution-chart';
import AdverseEventsChart from '@/components/dashboard/charts/adverse-events-chart';
import SitePerformanceChart from '@/components/dashboard/charts/site-performance-chart';
import type { PredictionInput } from '@/ai/flows/predictive-analysis-flow';
import type { Site, Subject, Visit, Form, Field, LovValue } from '@/types';

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
  qualitative: { charts: { id: string; component: React.ComponentType<{ data: any[] }>; title: string }[] };
  statistical: { operations: string[] };
  predictive: { type: string };
};

export type Filters = {
  sites: string[];
  subjects: string[];
  visits: string[];
  forms: string[];
  fields: string[];
  lovs: string[];
  operations: string[];
};

export interface DashboardState {
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
   sites: Site[];
  subjects: Subject[];
  visits: Visit[];
  forms: Form[];
  fields: Field[];
  lovs: LovValue[];
 
  isLoadingSubjects: boolean;
  isLoadingSites: boolean;

  siteOptions: SelectOption[];
  subjectOptions: SelectOption[];
  visitOptions: SelectOption[];
  formOptions: SelectOption[];
  fieldOptions: SelectOption[];
  lovOptions: SelectOption[];

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

  fetchSites: () => Promise<void>;
  fetchSubjects: (siteId?: string) => Promise<void>;
  fetchVisits: (subjectId: string) => Promise<void>;
  fetchForms: (visitId: string) => Promise<void>;
  fetchFields: ( visitId: string, formId: string) => Promise<void>;
  fetchLovs: (fieldId: string) => Promise<void>;
}

const createDefaultLayout = (): DashboardLayout => ({
  id: 'default',
  name: 'Default View',
  qualitative: { charts: allCharts },
  statistical: { operations: [] },
  predictive: { type: 'site-enrollment' }
});

export const createDashboardStore = () =>
  createStore<DashboardState>((set, get) => ({
    layouts: [],
    activeLayout: null,
    activeTab: 'qualitative',
    filters: { sites: [], subjects: [], visits: [], forms: [], fields: [], lovs: [], operations: [] },
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
    sites: [],
    isLoadingSites: true,
    subjects: [],
     isLoadingSubjects: true,
    visits: [],    
    forms: [],
    fields: [],
    lovs: [],
   

    siteOptions: [],
    subjectOptions: [],
    visitOptions: [],
    formOptions: [],
    fieldOptions: [],
    lovOptions: [],

    // Layout logic preserved...
    fetchLayouts: async () => {
    set({ isLoading: true });
    try {
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
       // We'll let the component show the toast
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
      console.log("Dashboard layout saved successfully.");
    } catch (error: any) {
      console.error("Failed to save dashboard layout:", error);
      console.log(error.message);
    } },

    setChartLayout: (charts) => { 
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

    setActiveTab: (tab) => set({ activeTab: tab }),

    applyFilters: (newFilters) => {
      set({ filters: newFilters, isFetchingNewData: true });
      if (newFilters.sites.length) {
        get().fetchSubjects(newFilters.sites[0]);
      }
      setTimeout(() => {
        set({ isFetchingNewData: false, activeTab: 'statistical' });
      }, 1500);
    },

    fetchQualitativeCharts: async () => { const { activeLayout } = get();
    if (!activeLayout || !activeLayout.qualitative?.charts?.length) return;

    try {
        const dataPromises = activeLayout.qualitative.charts.map(chart =>
            fetch(`/api/charts/${chart.id}`).then(async res => {
            const text = await res.text();
            return text ? JSON.parse(text) : [];
  })
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

    generateInsight: async (chartId, chartTitle, chartData) => {
       if (!chartData) {
        console.error("Chart data is not available for insight generation.");
        throw new Error("Chart data not available.");
        
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
        set({ isModalOpen: false });
        throw error;
    } finally {
        set({ isLoadingInsight: false });
    }
      
      },

    generatePrediction: async (input) => {
       set({ isLoadingPrediction: true, currentPrediction: '' });
    try {
        const result = await getPrediction(input);
        set({ currentPrediction: result.prediction });
    } catch (error: any) {
         console.error("Failed to generate prediction:", error);
        throw error;
    } finally {
        set({ isLoadingPrediction: false });
    }
      },

    // New secure filter fetchers
    fetchSites: async () => {
      set({ isLoadingSites: true });
      try {
        const res = await fetch(`/api/filters?type=sites`);
        if (res.ok) {
          const data = await res.json();
          set({
            sites: data,
            siteOptions: data.map((s: any) => ({ label: s.name, value: s.id.toString() })),
            isLoadingSites: false
          });
        }
      } catch (e) {
        console.error('Failed to fetch sites:', e);
        set({ sites: [], isLoadingSites: false });
      }
    },

    fetchSubjects: async (siteId) => {
      set({ isLoadingSubjects: true });
      try {
        const id = siteId || get().filters.sites[0];
        const res = await fetch(`/api/filters?type=subjects&id=${id}`);
        if (res.ok) {
          const data = await res.json();
          set({
            subjects: data,
            visitOptions: data.map((s: any) => ({ label: s.name, value: s.id.toString() })),
            isLoadingSubjects: false
          });
        }
      } catch (e) {
        console.error('Failed to fetch subjects:', e);
        set({ subjects: [], isLoadingSubjects: false });
      }
    },

    fetchVisits: async (subjectId) => {
      const res = await fetch(`/api/filters?type=visits&id=${subjectId}`);
      if (res.ok) {
        const data = await res.json();
        set({ visitOptions: data.map((v: any) => ({ label: v.name, value: v.id.toString() })) });
      }
    },

    fetchForms: async (visitId) => {
      const res = await fetch(`/api/filters?type=forms&id=${visitId}`);
      if (res.ok) {
        const data = await res.json();
        set({ formOptions: data.map((f: any) => ({ label: f.name, value: f.id.toString() })) });
      }
    },

    fetchFields: async (formId) => {
      // const { visitId } = get(); // Zustand's state getter to access current visitId
  // if (!visitId) return; // optional safety check
      const res = await fetch(`/api/filters?type=fields&id=${formId}`);
      if (res.ok) {
        const data = await res.json();
        set({ fieldOptions: data.map((f: any) => ({ label: f.name, value: f.id.toString() })) });
      }
    },

    fetchLovs: async (fieldId) => {
      const res = await fetch(`/api/filters?type=lovs&id=${fieldId}`);
      if (res.ok) {
        const data = await res.json();
        set({ lovOptions: data.map((l: any) => ({ label: l.name, value: l.id.toString() })) });
      }
    },

    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false, currentTitle: '', currentInsight: '' }),
    setPredictionType: (type) => set({ predictionType: type }),
  }));
