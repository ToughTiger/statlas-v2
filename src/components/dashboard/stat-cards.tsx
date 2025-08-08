
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, Target, Activity, HeartPulse, Siren, CheckCircle2, Icon } from "lucide-react"
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

type Stat = {
  title: string;
  value: string;
  icon: string;
  change: string;
  textColor: string;
  iconColor: string;
  bgColor: string;
}

const iconMap: { [key: string]: Icon } = {
    Users,
    Target,
    Activity,
    HeartPulse,
    Siren,
    CheckCircle2
};

export default function StatCards() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.icon];
        return (
          <Card key={index} className={stat.bgColor}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
                {stat.title}
              </CardTitle>
              {IconComponent && <IconComponent className={`h-5 w-5 ${stat.iconColor}`} />}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
              <p className={`text-xs ${stat.textColor} opacity-75`}>{stat.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
