import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HeartPulse, Thermometer, Droplets, Flame } from 'lucide-react';

interface SingleMetricCardProps {
  title: string;
  value: string; // Value is pre-formatted
  unit: string;
  icon: React.ReactElement<{ className?: string }>;
  description?: string; // Combined timeframe and change
  cardClassName?: string; // For gradient background
}

const SingleMetricCard: React.FC<SingleMetricCardProps> = ({ title, value, unit, icon, description, cardClassName }) => {
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
        <div className="text-3xl font-bold text-white">
          {value}
          <span className="text-sm font-normal text-white/80 ml-1">{unit}</span>
        </div>
        {description && <p className="text-xs text-white/80 pt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

const healthMetricCardStyles = [
  { bg: "bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700" },      // Heart Rate
  { bg: "bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700" },// Temperature
  { bg: "bg-gradient-to-br from-lime-500 to-emerald-600 hover:from-lime-600 hover:to-emerald-700" },  // Humidity
  { bg: "bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" },  // Heat Index
];

export function HealthMetrics({ sensorData }: { sensorData: any[] }) {
  const latest = sensorData && sensorData.length > 0 ? sensorData[0] : {};

  const formatDescription = (timeframe?: string, change?: number): string | undefined => {
    if (!timeframe && !change) return undefined;
    let desc = timeframe || "";
    if (change) {
      const changeText = `${change > 0 ? '↑' : '↓'} ${Math.abs(change)}%`;
      desc = desc ? `${desc} (${changeText})` : changeText;
    }
    return desc;
  };

  const metricsToDisplay = [
    {
      title: "Heart Rate",
      value: latest.beat_avg?.toFixed(0) || "N/A",
      unit: "bpm",
      icon: <HeartPulse />,
      description: formatDescription("Last reading", latest.beat_avg_change), // Assuming a 'beat_avg_change' field exists or is calculated
      cardClassName: healthMetricCardStyles[0].bg,
    },
    {
      title: "Temperature",
      value: latest.temperature_c?.toFixed(1) || "N/A",
      unit: "°C",
      icon: <Thermometer />,
      description: formatDescription("Current", latest.temperature_c_change),
      cardClassName: healthMetricCardStyles[1].bg,
    },
    {
      title: "Humidity",
      value: latest.humidity?.toFixed(1) || "N/A",
      unit: "%",
      icon: <Droplets />,
      description: formatDescription("Room condition", latest.humidity_change),
      cardClassName: healthMetricCardStyles[2].bg,
    },
    {
      title: "Heat Index",
      value: latest.heat_index_c?.toFixed(1) || "N/A",
      unit: "°C",
      icon: <Flame />,
      description: formatDescription("Feels like", latest.heat_index_c_change),
      cardClassName: healthMetricCardStyles[3].bg,
    },
  ];

  if (!sensorData || sensorData.length === 0) {
    // Optional: Render placeholder/loading cards if data is not yet available
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {healthMetricCardStyles.map((style, index) => (
          <Card key={`placeholder-${index}`} className={cn("shadow-lg border-0 h-[124px]", style.bg)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
              <div className="h-4 w-20 bg-white/30 rounded animate-pulse" /> 
              <div className="p-2 rounded-lg bg-white/20">
                 {/* Placeholder for icon */}
                 <div className="h-5 w-5 bg-white/30 rounded-full animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent className="pb-4 px-4">
              <div className="h-8 w-12 bg-white/30 rounded mb-1 animate-pulse" />
              <div className="h-3 w-16 bg-white/30 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricsToDisplay.map((metric) => (
        <SingleMetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          unit={metric.unit}
          icon={metric.icon}
          description={metric.description}
          cardClassName={metric.cardClassName}
        />
      ))}
    </div>
  );
}