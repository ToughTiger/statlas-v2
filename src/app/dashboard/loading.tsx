import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-8 w-1/3" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[120px] w-full" />
        ))}
      </div>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
         <Skeleton className="h-[300px] w-full" />
         <Skeleton className="h-[300px] w-full" />
      </div>
       <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
