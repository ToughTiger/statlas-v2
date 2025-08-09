"use client";

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type DashboardState, createDashboardStore } from './dashboard-store';

export const DashboardStoreContext = createContext<StoreApi<DashboardState> | null>(null);

export interface DashboardStoreProviderProps {
  children: ReactNode;
}

export const DashboardStoreProvider = ({ children }: DashboardStoreProviderProps) => {
  const storeRef = useRef<StoreApi<DashboardState>>();
  if (!storeRef.current) {
    storeRef.current = createDashboardStore();
  }

  return (
    <DashboardStoreContext.Provider value={storeRef.current}>
      {children}
    </DashboardStoreContext.Provider>
  );
};

export const useDashboardStore = <T,>(selector: (store: DashboardState) => T): T => {
  const dashboardStoreContext = useContext(DashboardStoreContext);

  if (!dashboardStoreContext) {
    throw new Error('useDashboardStore must be used within a DashboardStoreProvider');
  }

  return useStore(dashboardStoreContext, selector);
};
