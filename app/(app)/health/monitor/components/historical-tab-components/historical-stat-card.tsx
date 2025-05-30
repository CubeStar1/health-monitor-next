"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface StatData {
  avg: number;
  min: number;
  max: number;
  count: number;
}

interface HistoricalStatCardProps {
  title: string;
  stats: StatData;
  unit: string;
  icon: React.ReactNode;
  className?: string;
  gradient?: string; // Optional gradient class
}

export function HistoricalStatCard({
  title,
  stats,
  unit,
  icon,
  className,
  gradient = "bg-gradient-to-br from-blue-500 to-purple-600"
}: HistoricalStatCardProps) {
  return (
    <Card className={cn("shadow-lg text-white flex flex-col h-full", gradient, className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="flex-grow pt-2 pb-4 px-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <TrendingUp className="h-4 w-4 text-white/70" />
            <span className="text-xs font-medium text-white/80">Avg:</span>
            <span className="text-lg font-bold">{stats.avg.toFixed(2)}</span>
            <span className="text-xs text-white/90">{unit}</span>
          </div>
          <div className="flex items-center space-x-2 mb-1.5">
            <ArrowDownCircle className="h-4 w-4 text-white/70" />
            <span className="text-xs font-medium text-white/80">Min:</span>
            <span className="text-base font-semibold">{stats.min.toFixed(2)}</span>
            <span className="text-xs text-white/90">{unit}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowUpCircle className="h-4 w-4 text-white/70" />
            <span className="text-xs font-medium text-white/80">Max:</span>
            <span className="text-base font-semibold">{stats.max.toFixed(2)}</span>
            <span className="text-xs text-white/90">{unit}</span>
          </div>
        </div>
        <div className="text-center mt-3">
          <p className="text-xs text-white/70">({stats.count} records)</p>
        </div>
      </CardContent>
    </Card>
  );
}
