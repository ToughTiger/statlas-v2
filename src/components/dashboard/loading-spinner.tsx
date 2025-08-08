
"use client";

import { Loader } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">Loading data...</p>
    </div>
  );
}
