import * as React from 'react';
import { Activity, Apple, FileText, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactElement<{ className?: string }>;
  cardClassName?: string; // For gradient background
}

const SingleStatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description, cardClassName }) => {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-[1.02] border-0", cardClassName)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-white">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-white/20">
          {React.cloneElement(icon, {
            className: cn(icon.props.className, "h-5 w-5", "text-white/90")
          })}
        </div>
      </CardHeader>
      <CardContent className="pb-4 px-4">
        <div className="text-3xl font-bold text-white">{value}</div>
        {description && <p className="text-xs text-white/80 pt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

interface StatsCardsProps {
  healthRecords: any[];
  nutritionLogs: any[];
  stravaActivities: any[];
  reports: any[];
}

const dashboardCardStyles = [
  { bg: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" },      // Health Records
  { bg: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" },  // Nutrition Logs
  { bg: "bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700" },// Activities
  { bg: "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" },          // Reports
];

export function StatsCards({ healthRecords, nutritionLogs, stravaActivities, reports }: StatsCardsProps) {
  const statsToDisplay = [
    {
      title: "Health Records",
      value: healthRecords.length.toString(),
      description: "Total records uploaded",
      icon: <FileText />,
      cardClassName: dashboardCardStyles[0].bg,
    },
    {
      title: "Nutrition Logs",
      value: nutritionLogs.length.toString(),
      description: `${nutritionLogs.filter(l => new Date(l.date).toDateString() === new Date().toDateString()).length} entries today`,
      icon: <Apple />,
      cardClassName: dashboardCardStyles[1].bg,
    },
    {
      title: "Activities",
      value: stravaActivities.length.toString(),
      description: `${stravaActivities.filter(a => new Date(a.start_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} in last 7 days`,
      icon: <Activity />,
      cardClassName: dashboardCardStyles[2].bg,
    },
    {
      title: "Reports",
      value: reports.length.toString(),
      description: `${reports.filter(r => r.status === 'completed').length} completed`,
      icon: <Heart />,
      cardClassName: dashboardCardStyles[3].bg,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsToDisplay.map((stat) => (
        <SingleStatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          cardClassName={stat.cardClassName}
        />
      ))}
    </div>
  );
}