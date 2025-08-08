
import { NextResponse } from 'next/server';
import { getSubjectCount, getEnrollmentCount, getScreeningCount, getWithdrawnCount, getCompletedCount } from '@/lib/server-api';

export async function GET() {
  try {
    // We can use Promise.all to fetch all counts in parallel for better performance
    const [
      subjectData,
      screeningData,
      enrolledData,
      withdrawnData,
      completedData
    ] = await Promise.all([
      getSubjectCount(),
      getScreeningCount(),
      getEnrollmentCount(),
      getWithdrawnCount(),
      getCompletedCount()
    ]);

    const stats = [
      {
        title: "Total Subjects",
        value: subjectData?.count?.toString() ?? "0",
        icon: "Users",
        change: "+20.1% from last month",
        textColor: "text-blue-900",
        iconColor: "text-blue-800",
        bgColor: "bg-blue-200",
      },
      {
        title: "Screening",
        value: screeningData?.count?.toString() ?? "0",
        icon: "Target",
        change: "+180.1% from last month",
        textColor: "text-orange-900",
        iconColor: "text-orange-800",
        bgColor: "bg-orange-200",
      },
      {
        title: "Enrolled",
        value: enrolledData?.count?.toString() ?? "0",
        icon: "Activity",
        change: "+19% from last month",
        textColor: "text-green-900",
        iconColor: "text-green-800",
        bgColor: "bg-green-200",
      },
      {
        title: "Withdrawn",
        value: withdrawnData?.count?.toString() ?? "0",
        icon: "HeartPulse",
        change: "+2 since last month",
        textColor: "text-yellow-900",
        iconColor: "text-yellow-800",
        bgColor: "bg-yellow-200",
      },
      {
          title: "Adverse Events",
          value: "38", // This seems to be a static value in the old mock
          icon: "Siren",
          change: "+5 this week",
          textColor: "text-red-900",
          iconColor: "text-red-800",
          bgColor: "bg-red-200",
      },
      {
          title: "Completed",
          value: completedData?.count?.toString() ?? "0",
          icon: "CheckCircle2",
          change: "Target: 450", // This could also be dynamic in the future
          textColor: "text-indigo-900",
          iconColor: "text-indigo-800",
          bgColor: "bg-indigo-200",
      }
    ];

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return new NextResponse(JSON.stringify({ message: "Failed to fetch stats" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
