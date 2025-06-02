"use client"

import { useEffect, useState } from "react";
import { Activity, DetailedActivity } from "../types";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Footprints, TrendingUp, Bike, Mountain, Clock, Zap, HeartPulse, Gauge, CalendarDays, Route, ActivityIcon as GenericActivityIcon, LineChart as LineChartIcon, AlertCircle } from 'lucide-react'; 
import { cn } from '@/lib/utils';

interface ActivityDetailsProps {
  activity: Activity;
}

const HeaderActivityIcon = ({ type, className }: { type: string, className?: string }) => {
  const lowerType = type.toLowerCase();
  const iconProps = { className: cn("h-8 w-8", className) };
  if (lowerType.includes('run')) return <TrendingUp {...iconProps} />;
  if (lowerType.includes('ride') || lowerType.includes('bike')) return <Bike {...iconProps} />;
  if (lowerType.includes('walk')) return <Footprints {...iconProps} />;
  return <GenericActivityIcon {...iconProps} />;
};

const formatStat = (value: number | undefined | null, unit: string = "", decimals: number = 1) => {
  if (value === undefined || value === null) return <span className="text-muted-foreground/70">N/A</span>;
  return <>{`${value.toFixed(decimals)} ${unit}`.trim()}</>;
};

const formatDuration = (seconds: number | undefined | null) => {
  if (seconds === undefined || seconds === null) return <span className="text-muted-foreground/70">N/A</span>;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return <>{`${h > 0 ? `${h}h ` : ''}${m > 0 ? `${m}m ` : ''}${s}s`}</>;
};

const formatPaceTooltip = (value: number) => {
  const totalSeconds = Math.round(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
};

const activityDetailsChartConfig = {
  heartRate: { label: "Heart Rate", color: "hsl(var(--chart-1))" },
  speed: { label: "Speed", color: "hsl(var(--chart-2))" },
  power: { label: "Power", color: "hsl(var(--chart-3))" },
  pace: { label: "Pace", color: "hsl(150, 70%, 60%)" },
  elevation: { label: "Elevation", color: "hsl(340 75% 55%)" },
} satisfies ChartConfig;

export function ActivityDetails({ activity }: ActivityDetailsProps) {
  const [detailedActivityData, setDetailedActivityData] = useState<DetailedActivity | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetailedActivity() {
      if (!activity.id) return;
      setIsLoadingDetails(true);
      setErrorDetails(null);
      try {
        const response = await fetch(`/api/strava/activities/${activity.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch detailed activity: ${response.statusText}`);
        }
        const data = await response.json();
        setDetailedActivityData(data);
      } catch (error) {
        console.error('Error fetching detailed activity:', error);
        setErrorDetails(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoadingDetails(false);
      }
    }
    fetchDetailedActivity();
  }, [activity.id]);

  const heartRateData = activity.average_heartrate ? [{ name: "Avg HR", value: activity.average_heartrate, fill: activityDetailsChartConfig.heartRate.color }] : [];
  const speedData = activity.average_speed ? [{ name: "Avg Speed", value: activity.average_speed * 3.6, fill: activityDetailsChartConfig.speed.color }] : [];
  const powerData = activity.average_watts ? [{ name: "Avg Power", value: activity.average_watts, fill: activityDetailsChartConfig.power.color }] : [];

  const statItems = [
    { icon: Route, label: "Distance", value: formatStat(activity.distance / 1000, "km", 2) },
    { icon: Clock, label: "Duration", value: formatDuration(activity.moving_time) },
    { icon: Gauge, label: "Avg Speed", value: formatStat(activity.average_speed ? activity.average_speed * 3.6 : null, "km/h") },
    { icon: Mountain, label: "Elevation", value: formatStat(activity.total_elevation_gain, "m", 0) },
  ];

  if (activity.average_heartrate) {
    statItems.push({ icon: HeartPulse, label: "Avg HR", value: formatStat(activity.average_heartrate, "bpm", 0) });
  }
  if (activity.average_watts) {
    statItems.push({ icon: Zap, label: "Avg Power", value: formatStat(activity.average_watts, "W", 0) });
  }

  const paceChartData = detailedActivityData?.splits_metric
    ? detailedActivityData.splits_metric.map((split, index) => ({
        kilometer: index + 1,
        pace: split.average_speed > 0 ? 1000 / split.average_speed : 0, // seconds per km
        fill: activityDetailsChartConfig.pace.color,
      }))
    : [];

  const elevationChartData = detailedActivityData?.splits_metric
    ? detailedActivityData.splits_metric.map((split, index) => ({
        kilometer: index + 1,
        elevation: split.elevation_difference,
        fill: activityDetailsChartConfig.elevation.color,
      }))
    : [];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-background max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
      {/* Header Card */}
      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/30 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <HeaderActivityIcon type={activity.type} className="text-primary" />
            <div className="flex-grow">
              <CardTitle className="text-xl sm:text-2xl font-semibold leading-tight">{activity.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground flex items-center mt-1">
                <CalendarDays className="h-4 w-4 mr-1.5" />
                {activity.type} on {new Date(activity.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5 text-sm">
          {statItems.map(item => (
            <div key={item.label} className="flex items-start space-x-2.5">
              <item.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                <p className="font-semibold text-base sm:text-lg">{item.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Average Metrics Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {activity.average_heartrate && heartRateData.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <HeartPulse className="h-5 w-5 mr-2 text-red-500" /> Average Heart Rate
              </CardTitle>
              <CardDescription>Your average heart rate during the activity.</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] pl-0 pr-2 pb-2 pt-0">
              <ChartContainer config={activityDetailsChartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={heartRateData} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 0 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 'dataMax + 20']} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={60} fontSize={12} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" formatter={(value) => [`${Number(value).toFixed(0)} bpm`, 'Avg HR']} hideLabel />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
        {/* Other average metric charts (Speed, Power) follow the same pattern... */}
        {activity.average_speed && speedData.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <Gauge className="h-5 w-5 mr-2 text-blue-500" /> Average Speed
              </CardTitle>
              <CardDescription>Your average speed throughout the activity.</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] pl-0 pr-2 pb-2 pt-0">
              <ChartContainer config={activityDetailsChartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={speedData} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 0 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 'dataMax + 5']} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={70} fontSize={12} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" formatter={(value) => [`${Number(value).toFixed(1)} km/h`, 'Avg Speed']} hideLabel />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
        {activity.average_watts && powerData.length > 0 && (
           <Card className="md:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" /> Average Power
              </CardTitle>
              <CardDescription>Your average power output if recorded.</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] pl-0 pr-2 pb-2 pt-0">
              <ChartContainer config={activityDetailsChartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={powerData} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 0 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 'dataMax + 50']} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={70} fontSize={12} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" formatter={(value) => [`${Number(value).toFixed(0)} W`, 'Avg Power']} hideLabel />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Charts Section */}
      {isLoadingDetails && (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="shadow-sm"><CardHeader><Skeleton className="h-5 w-3/5" /></CardHeader><CardContent><Skeleton className="h-[250px] w-full" /></CardContent></Card>
          <Card className="shadow-sm"><CardHeader><Skeleton className="h-5 w-3/5" /></CardHeader><CardContent><Skeleton className="h-[250px] w-full" /></CardContent></Card>
        </div>
      )}
      {errorDetails && (
        <Card className="mt-6 shadow-sm bg-destructive/10 border-destructive/50">
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" /> Error Loading Detailed Charts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive-foreground">{errorDetails}</p>
            <p className="text-xs text-destructive-foreground/80 mt-1">Could not load pace and elevation split data. Please try again later.</p>
          </CardContent>
        </Card>
      )}
      {!isLoadingDetails && !errorDetails && detailedActivityData && (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {paceChartData.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center">
                  <LineChartIcon className="h-5 w-5 mr-2 text-purple-500" /> Pace Over Distance
                </CardTitle>
                <CardDescription>Your pace for each kilometer of the activity.</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] p-4">
                <ChartContainer config={activityDetailsChartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={paceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="kilometer" unit="km" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                      <YAxis tickFormatter={formatPaceTooltip} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} domain={['dataMin - 30', 'dataMax + 30']}/>
                      <ChartTooltip 
                        cursor={false} 
                        content={<ChartTooltipContent 
                          indicator="dot" 
                          labelFormatter={(label) => `Kilometer ${label}`}
                          formatter={(value) => [formatPaceTooltip(Number(value)), 'Pace']}
                        />}
                      />
                      <Area type="monotone" dataKey="pace" stroke={activityDetailsChartConfig.pace.color} fillOpacity={0.3} strokeWidth={2} dot={false} fill="hsl(150, 70%, 60%)"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
          {elevationChartData.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center">
                  <Mountain className="h-5 w-5 mr-2 text-teal-500" /> Elevation Profile
                </CardTitle>
                <CardDescription>Elevation changes over the distance of your activity.</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] p-4">
                <ChartContainer config={activityDetailsChartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={elevationChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="kilometer" unit="km" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                      <YAxis unit="m" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} domain={['dataMin - 10', 'dataMax + 10']}/>
                      <ChartTooltip 
                        cursor={false} 
                        content={<ChartTooltipContent 
                          indicator="dot" 
                          labelFormatter={(label) => `Kilometer ${label}`}
                          formatter={(value) => [`${Number(value).toFixed(1)} m`, 'Elevation']}
                        />}
                      />
                      <Area type="monotone" dataKey="elevation" stroke={activityDetailsChartConfig.elevation.color} fillOpacity={0.3} strokeWidth={2} dot={false} fill="hsl(340 75% 55%)"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

    </div>
  );
}
