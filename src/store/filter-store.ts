import { create } from 'zustand';

interface Option {
  label: string;
  value: string;
}

interface FilterState {
  // Selected IDs
  selectedSiteId: string | null;
  selectedSubjectId: string | null;
  selectedVisitId: string | null;
  selectedFormId: string | null;
  selectedFieldId: string | null;

  // Dropdown options
  siteOptions: Option[];
  subjectOptions: Option[];
  visitOptions: Option[];
  formOptions: Option[];
  fieldOptions: Option[];

  // Actions
  setSelectedSiteId: (id: string | null) => void;
  setSelectedSubjectId: (id: string | null) => void;
  setSelectedVisitId: (id: string | null) => void;
  setSelectedFormId: (id: string | null) => void;
  setSelectedFieldId: (id: string | null) => void;

  fetchSites: () => Promise<void>;
  fetchSubjects: (siteId: string) => Promise<void>;
  fetchVisits: (subjectId: string) => Promise<void>;
  fetchForms: (visitId: string) => Promise<void>;
  fetchFields: (visitId: string, formId: string) => Promise<void>;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedSiteId: null,
  selectedSubjectId: null,
  selectedVisitId: null,
  selectedFormId: null,
  selectedFieldId: null,

  siteOptions: [],
  subjectOptions: [],
  visitOptions: [],
  formOptions: [],
  fieldOptions: [],

  setSelectedSiteId: (id) => set({ selectedSiteId: id }),
  setSelectedSubjectId: (id) => set({ selectedSubjectId: id }),
  setSelectedVisitId: (id) => set({ selectedVisitId: id }),
  setSelectedFormId: (id) => set({ selectedFormId: id }),
  setSelectedFieldId: (id) => set({ selectedFieldId: id }),

  fetchSites: async () => {
    const res = await fetch('/api/filters?type=sites');
    if (res.ok) {
      const data = await res.json();
      set({ siteOptions: data.map((s: any) => ({ label: s.name, value: s.id.toString() })) });
    }
  },

  fetchSubjects: async (siteId) => {
    const res = await fetch(`/api/filters?type=subjects&id=${siteId}`);
    if (res.ok) {
      const data = await res.json();
      set({ subjectOptions: data.map((s: any) => ({ label: s.name, value: s.id.toString() })) });
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

  fetchFields: async (visitId, formId) => {
    const res = await fetch(`/api/filters?type=fields&visitId=${visitId}&formId=${formId}`);
    if (res.ok) {
      const data = await res.json();
      set({ fieldOptions: data.map((f: any) => ({ label: f.name, value: f.id.toString() })) });
    }
  },
}));
