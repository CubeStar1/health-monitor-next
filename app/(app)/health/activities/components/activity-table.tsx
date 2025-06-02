"use client"

import { useState } from 'react';
import { Activity } from '../types';
import { formatDistance, formatDuration, formatElevation } from '../utils'; // Assuming formatPace might not be needed or can be added
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActivityDetails } from './activity-details'; // Assuming this component exists and is styled appropriately
import { TrendingUp, Bike, Footprints, Mountain, Clock, ExternalLink, Eye } from 'lucide-react'; // Added Eye for view details, corrected Run to TrendingUp, FootprintsIcon to Footprints

interface ActivityTableProps {
  activities: Activity[];
}

const ActivityIcon = ({ type }: { type: string }) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('run')) return <TrendingUp className="h-5 w-5 text-blue-500" />;
  if (lowerType.includes('ride') || lowerType.includes('bike')) return <Bike className="h-5 w-5 text-green-500" />;
  if (lowerType.includes('walk')) return <Footprints className="h-5 w-5 text-orange-500" />;
  return <Footprints className="h-5 w-5 text-gray-500" />;
};

export default function ActivityTable({ activities }: ActivityTableProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Distance</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Elevation</TableHead>
              <TableHead className="text-center w-[120px]">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell><ActivityIcon type={activity.type} /></TableCell>
                <TableCell className="font-medium truncate max-w-xs">{activity.name}</TableCell>
                <TableCell>{new Date(activity.start_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">{formatDistance(activity.distance)}</TableCell>
                <TableCell className="text-right">{formatDuration(activity.moving_time)}</TableCell>
                <TableCell className="text-right">{formatElevation(activity.total_elevation_gain)}</TableCell>
                <TableCell className="text-center">
                    <Button variant="outline" size="sm" onClick={() => handleSelectActivity(activity)}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Dialog for Activity Details - ensure it's outside the TableRow mapping for proper rendering */} 
      <Dialog open={!!selectedActivity} onOpenChange={(isOpen) => !isOpen && setSelectedActivity(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {selectedActivity && <ActivityDetails activity={selectedActivity} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
