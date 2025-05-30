"use client";

import { useState, useEffect, useCallback } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { HealthData } from '@/lib/types/health-types';
import { DateRange } from 'react-day-picker';

interface UseHistoricalHealthDataReturn {
  data: HealthData[];
  loading: boolean;
  error: Error | null;
  fetchData: (range: DateRange | undefined, timeRange: [number, number]) => Promise<void>;
}

export function useHistoricalHealthData(): UseHistoricalHealthDataReturn {
  const [data, setData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createSupabaseBrowser();

  const fetchData = useCallback(async (range: DateRange | undefined, timeRangeNC: [number, number]) => {
    if (!range || !range.from || !range.to) {
      setData([]); // Clear data if range is incomplete or timeRange is invalid
      return;
    }
    const timeRange = timeRangeNC || [0,23]; // Ensure timeRange is defined

    setLoading(true);
    setError(null);

    try {
      const fromDate = new Date(range.from);
      fromDate.setHours(timeRange[0], 0, 0, 0); // Set start time

      const toDate = new Date(range.to);
      // If fromDate and toDate are the same, and endHour is less than startHour, it implies crossing midnight - this isn't handled by simple date range.
      // For simplicity, we assume endHour is on the same day or subsequent days as per date range picker.
      // If endHour is 23, it means up to 23:59:59. If 0, it means up to 00:59:59.
      toDate.setHours(timeRange[1], 59, 59, 999); // Set end time, ensuring the whole hour is covered
      
      // Safety check: if the calculated fromDate is after toDate due to time settings on the same day, adjust toDate to be end of that day for sensible query
      // This scenario is less likely with a range slider where minTime <= maxTime, but good for robustness.
      if (fromDate.getTime() > toDate.getTime() && range.from.toDateString() === range.to.toDateString()) {
         // This case implies an invalid time range selection on a single day (e.g. 10:00 to 08:00)
         // Or, if the slider allows fromTime > toTime, we might need a more complex logic or UI constraint.
         // For now, we'll fetch for the whole selected day if such an invalid sub-day range is given.
         // Alternatively, clear data or show an error.
         toDate.setHours(23, 59, 59, 999); // Fallback to full day if time range is inverted on single day selection
         if (timeRange[0] > timeRange[1]) { // If start hour is greater than end hour on the same day
            setData([]); // Clear data for invalid single-day time range
            setLoading(false);
            setError(new Error("Invalid time range: Start time cannot be after end time on the same day."));
            return;
         }
      }

      const { data: fetchedData, error: fetchError } = await supabase
        .from('sensor_data')
        .select('*')
        .gte('created_at', fromDate.toISOString())
        .lte('created_at', toDate.toISOString())
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }
      setData(fetchedData || []);
    } catch (e) {
      setError(e as Error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Initial fetch for a default range (e.g., last 7 days) can be added here if needed
  // useEffect(() => {
  //   const defaultTo = new Date();
  //   const defaultFrom = new Date();
  //   defaultFrom.setDate(defaultTo.getDate() - 7);
  //   fetchData({ from: defaultFrom, to: defaultTo });
  // }, [fetchData]);

  return { data, loading, error, fetchData };
}
