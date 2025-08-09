import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function SubjectDetailLoading() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-pulse">
      <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-7 w-1/3" />
      </div>
       <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card><CardHeader><Skeleton className="h-5 w-2/3 mb-2" /></CardHeader><CardContent><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-5 w-2/3 mb-2" /></CardHeader><CardContent><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-5 w-2/3 mb-2" /></CardHeader><CardContent><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-5 w-2/3 mb-2" /></CardHeader><CardContent><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-[350px] w-full" />
      </div>
    </main>
  );
}
