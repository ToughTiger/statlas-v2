import { create } from 'zustand';

interface LayoutState {
  layouts: any[];
  activeLayout: string | null;
  activeTab: string;

  setLayouts: (layouts: any[]) => void;
  setActiveLayout: (layoutId: string | null) => void;
  setActiveTab: (tab: string) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  layouts: [],
  activeLayout: null,
  activeTab: 'overview',

  setLayouts: (layouts) => set({ layouts }),
  setActiveLayout: (layoutId) => set({ activeLayout: layoutId }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
