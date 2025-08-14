import { create } from 'zustand';

interface Counts {
  totalSubjects?: number;
  totalVisits?: number;
  totalForms?: number;
  [key: string]: any;
}

interface ChartDataState {
  counts: Counts;
  enrolmentOverTime: any[];
  genderRaceEthnicity: any[];

  fetchQualitativeData: () => Promise<void>;
}

export const useChartDataStore = create<ChartDataState>((set) => ({
  counts: {},
  enrolmentOverTime: [],
  genderRaceEthnicity: [],

  fetchQualitativeData: async () => {
    const res = await fetch('/api/qualitative-data');
    if (res.ok) {
      const data = await res.json();
      set({
        counts: data.counts || {},
        enrolmentOverTime: data.enrolment_over_time || [],
        genderRaceEthnicity: data.gender_race_ethnicity || [],
      });
    }
  },
}));
