// c:\Users\avina\Projects\RVCE\2024\health-monitor\app\(app)\health\activities\components\activity-card-grid.tsx
"use client"

import { useState } from 'react';
import { Activity } from '../types';
import { formatDistance, formatDuration } from '../utils';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ActivityDetails } from './activity-details';
import { TrendingUp, Bike, Footprints, Clock4, Route } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ActivityCardGridProps {
  activities: Activity[];
}

const ActivityIcon = ({ type, className }: { type: string, className?: string }) => {
  const lowerType = type.toLowerCase();
  const iconClass = cn("h-7 w-7", className);
  if (lowerType.includes('run')) return <TrendingUp className={iconClass} />;
  if (lowerType.includes('ride') || lowerType.includes('bike')) return <Bike className={iconClass} />;
  if (lowerType.includes('walk')) return <Footprints className={iconClass} />;
  return <Footprints className={iconClass} />; // Default icon
};

// Define modern color palettes for cards based on activity type
const defaultPalette = { bg: "bg-gradient-to-br from-slate-700 to-slate-800", text: "text-slate-100", iconBg: "bg-slate-600/50", iconText: "text-slate-300" };

const activityTypePalettes: { [key: string]: typeof defaultPalette } = {
  run:    { bg: "bg-gradient-to-br from-sky-600 to-sky-800", text: "text-sky-100", iconBg: "bg-sky-500/40", iconText: "text-sky-300" },
  ride:   { bg: "bg-gradient-to-br from-emerald-600 to-emerald-800", text: "text-emerald-100", iconBg: "bg-emerald-500/40", iconText: "text-emerald-300" },
  walk:   { bg: "bg-gradient-to-br from-amber-600 to-amber-800", text: "text-amber-100", iconBg: "bg-amber-500/40", iconText: "text-amber-300" },
  swim:   { bg: "bg-gradient-to-br from-cyan-600 to-cyan-800", text: "text-cyan-100", iconBg: "bg-cyan-500/40", iconText: "text-cyan-300" },
  workout:{ bg: "bg-gradient-to-br from-purple-600 to-purple-800", text: "text-purple-100", iconBg: "bg-purple-500/40", iconText: "text-purple-300" },
  hike:   { bg: "bg-gradient-to-br from-orange-600 to-orange-800", text: "text-orange-100", iconBg: "bg-orange-500/40", iconText: "text-orange-300" },
  default: defaultPalette
};

const getPaletteForActivity = (activityType: string): typeof defaultPalette => {
  const lowerType = activityType.toLowerCase();
  for (const key in activityTypePalettes) {
    if (lowerType.includes(key)) {
      return activityTypePalettes[key];
    }
  }
  return activityTypePalettes.default;
};

export default function ActivityCardGrid({ activities }: ActivityCardGridProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activities.map((activity, index) => {
          const palette = getPaletteForActivity(activity.type);
          return (
            <motion.div
              key={activity.id}
              className={cn(
                "rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer group",
                palette.bg,
                palette.text
              )}
              onClick={() => handleSelectActivity(activity)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-3 rounded-lg transition-colors duration-300 group-hover:bg-white/20", palette.iconBg)}>
                    <ActivityIcon type={activity.type} className={palette.iconText} />
                  </div>
                  <span className="text-xs opacity-80 pt-1">{new Date(activity.start_date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-semibold mb-3 truncate group-hover:text-white h-7">{activity.name}</h3>
                <div className="flex flex-col space-y-2 text-sm opacity-90">
                  <div className="flex items-center">
                    <Route className="h-4 w-4 mr-2 opacity-70" />
                    <span>{formatDistance(activity.distance)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock4 className="h-4 w-4 mr-2 opacity-70" />
                    <span>{formatDuration(activity.moving_time)}</span>
                  </div>
                </div>
              </div>
              <div className={cn("px-5 py-3 text-xs font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300", palette.iconBg, "bg-opacity-50 group-hover:bg-opacity-75")}>
                View Details
              </div>
            </motion.div>
          );
        })}
      </div>
      <Dialog open={!!selectedActivity} onOpenChange={(isOpen) => !isOpen && setSelectedActivity(null)}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-4">
          {selectedActivity && <ActivityDetails activity={selectedActivity} />}
        </DialogContent>
      </Dialog>
    </>
  );
}