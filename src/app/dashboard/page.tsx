import { Header } from '@/components/dashboard/header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import QualitativeAnalysisTab from '@/components/dashboard/qualitative-analysis-tab';
import StatisticalAnalysisTab from '@/components/dashboard/statistical-analysis-tab';
import PredictiveAnalysisTab from '@/components/dashboard/predictive-analysis-tab';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { DashboardStoreProvider, useDashboardStore } from '@/store/dashboard-store-provider';
import DashboardTabs from '@/components/dashboard/dashboard-tabs';

export default function DashboardPage() {
  return (
    <DashboardStoreProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col w-full">
            <Header />
            <main id="dashboard-content" className="flex flex-1 flex-col gap-8 p-4 md:p-8 relative">
              <DashboardTabs />
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardStoreProvider>
  );
}
