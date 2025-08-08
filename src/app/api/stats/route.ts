
import { NextResponse } from 'next/server';

export async function GET() {
  const stats = [
    {
      title: "Total Subjects",
      value: "500",
      icon: "Users",
      change: "+20.1% from last month",
      textColor: "text-blue-900",
      iconColor: "text-blue-800",
      bgColor: "bg-blue-200",
    },
    {
      title: "Screening",
      value: "150",
      icon: "Target",
      change: "+180.1% from last month",
      textColor: "text-orange-900",
      iconColor: "text-orange-800",
      bgColor: "bg-orange-200",
    },
    {
      title: "Enrolled",
      value: "250",
      icon: "Activity",
      change: "+19% from last month",
      textColor: "text-green-900",
      iconColor: "text-green-800",
      bgColor: "bg-green-200",
    },
    {
      title: "Withdrawn",
      value: "15",
      icon: "HeartPulse",
      change: "+2 since last month",
      textColor: "text-yellow-900",
      iconColor: "text-yellow-800",
      bgColor: "bg-yellow-200",
    },
    {
        title: "Adverse Events",
        value: "38",
        icon: "Siren",
        change: "+5 this week",
        textColor: "text-red-900",
        iconColor: "text-red-800",
        bgColor: "bg-red-200",
    },
    {
        title: "Completed",
        value: "235",
        icon: "CheckCircle2",
        change: "Target: 450",
        textColor: "text-indigo-900",
        iconColor: "text-indigo-800",
        bgColor: "bg-indigo-200",
    }
  ];
  
  // In a real app, you'd fetch this data from a database
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  return NextResponse.json(stats);
}
