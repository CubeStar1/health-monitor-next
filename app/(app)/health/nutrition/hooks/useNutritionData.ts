"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import useUser from '@/hooks/use-user';
import {
  Food,
  DailyNutritionRecord,
  DailyCalorieSummary,
  WeeklyNutritionSummary,
  MonthlyNutritionSummary
} from '../types';

interface UseNutritionDataReturn {
  // Data states
  trackedFoods: Food[];
  historicalDailyData: DailyCalorieSummary[]; // For the 7-day view in 'Daily' tab
  weeklyData: WeeklyNutritionSummary | null;
  monthlyData: MonthlyNutritionSummary | null;
  totalCaloriesToday: number;

  // Loading states
  isLoadingDaily: boolean;
  isLoadingWeekly: boolean;
  isLoadingMonthly: boolean;
  isMutatingFoodLog: boolean; // For add/delete operations

  // Error states
  errorDaily: Error | null;
  errorWeekly: Error | null;
  errorMonthly: Error | null;

  // Functions
  addFoodEntry: (foodName: string) => Promise<void>;
  deleteFoodEntry: (foodId: string) => Promise<void>;
  fetchDailyData: (startDate: string, endDate: string, options?: { isMutationUpdate?: boolean }) => Promise<void>; 
  fetchWeeklyData: (endDate?: string, options?: { isMutationUpdate?: boolean }) => Promise<void>;
  fetchMonthlyData: (month: number, year: number, options?: { isMutationUpdate?: boolean }) => Promise<void>;
  refreshAllData: () => void; // To be called after add/delete
}

export default function useNutritionData(): UseNutritionDataReturn {
  const { data: user } = useUser();
  const { toast } = useToast();

  // Data states
  const [trackedFoods, setTrackedFoods] = useState<Food[]>([]);
  const [historicalDailyData, setHistoricalDailyData] = useState<DailyCalorieSummary[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyNutritionSummary | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyNutritionSummary | null>(null);
  const [totalCaloriesToday, setTotalCaloriesToday] = useState<number>(0);

  // Loading states
  const [isLoadingDaily, setIsLoadingDaily] = useState(false);
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(false);
  const [isLoadingMonthly, setIsLoadingMonthly] = useState(false);
  const [isMutatingFoodLog, setIsMutatingFoodLog] = useState(false);

  // Error states
  const [errorDaily, setErrorDaily] = useState<Error | null>(null);
  const [errorWeekly, setErrorWeekly] = useState<Error | null>(null);
  const [errorMonthly, setErrorMonthly] = useState<Error | null>(null);

  // --- Data Fetching Functions (to be implemented) ---
  const fetchDailyData = useCallback(async (startDate: string, endDate: string, options?: { isMutationUpdate?: boolean }) => {
    if (!user?.id) return;
    if (!options?.isMutationUpdate) setIsLoadingDaily(true);
    setErrorDaily(null);
    try {
      const response = await fetch(`/api/nutrition/daily?user_id=${user.id}&startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        if (response.status === 404) {
          setTrackedFoods([]);
          setHistoricalDailyData([]);
          setTotalCaloriesToday(0);
          return;
        }
        throw new Error("Failed to load daily nutrition data");
      }
      const data: DailyNutritionRecord[] = await response.json();
      
      const dailySummaries: DailyCalorieSummary[] = data.map(record => ({
        date: record.date,
        calories: record.consumed_foods.reduce((sum, food) => sum + food.calories, 0)
      }));
      setHistoricalDailyData(dailySummaries);

      const todayString = new Date().toISOString().split('T')[0];
      const todayData = data.find(record => record.date === todayString);

      if (todayData && todayData.consumed_foods) {
        setTrackedFoods(todayData.consumed_foods);
        setTotalCaloriesToday(todayData.consumed_foods.reduce((sum, food) => sum + food.calories, 0));
      } else {
        setTrackedFoods([]);
        setTotalCaloriesToday(0);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setErrorDaily(error);
      toast({ title: 'Error Loading Daily Data', description: error.message, variant: 'destructive' });
      setTrackedFoods([]);
      setHistoricalDailyData([]);
      setTotalCaloriesToday(0);
    } finally {
      if (!options?.isMutationUpdate) setIsLoadingDaily(false);
    }
  }, [user, toast]);

  const fetchWeeklyData = useCallback(async (endDate?: string, options?: { isMutationUpdate?: boolean }) => {
    if (!user?.id) return;
    if (!options?.isMutationUpdate) setIsLoadingWeekly(true);
    setErrorWeekly(null);
    try {
      const targetEndDate = endDate || new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/nutrition/weekly?user_id=${user.id}&endDate=${targetEndDate}`);
      if (!response.ok) {
        if (response.status === 404) {
          setWeeklyData(null); // Or a default empty state for weekly
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load weekly nutrition data');
      }
      const data: WeeklyNutritionSummary = await response.json();
      setWeeklyData(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setErrorWeekly(error);
      toast({ title: 'Error Loading Weekly Data', description: error.message, variant: 'destructive' });
      setWeeklyData(null);
    } finally {
      if (!options?.isMutationUpdate) setIsLoadingWeekly(false);
    }
  }, [user, toast]);

  const fetchMonthlyData = useCallback(async (month: number, year: number, options?: { isMutationUpdate?: boolean }) => {
    if (!user?.id) return;
    if (!options?.isMutationUpdate) setIsLoadingMonthly(true);
    setErrorMonthly(null);
    try {
      const response = await fetch(`/api/nutrition/monthly?user_id=${user.id}&month=${month}&year=${year}`);
      if (!response.ok) {
        if (response.status === 404) {
          setMonthlyData(null); // Or a default empty state for monthly
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load monthly nutrition data');
      }
      const data: MonthlyNutritionSummary = await response.json();
      setMonthlyData(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setErrorMonthly(error);
      toast({ title: 'Error Loading Monthly Data', description: error.message, variant: 'destructive' });
      setMonthlyData(null);
    } finally {
      if (!options?.isMutationUpdate) setIsLoadingMonthly(false);
    }
  }, [user, toast]);

  // --- Add/Delete Functions (to be moved from page.tsx and adapted) ---
  const addFoodEntry = async (foodName: string) => {
    setIsMutatingFoodLog(true);
    if (!user?.id) {
      toast({ title: 'Error', description: 'User not authenticated.', variant: 'destructive' });
      return;
    }
    try {
      const today = new Date().toISOString().split('T')[0];
      const userId = user.id;

      // 1. Ensure daily nutrition record exists for today
      let dailyNutritionId: string;
      const dailyResponse = await fetch(`/api/nutrition/daily?user_id=${userId}&date=${today}`);
      
      if (dailyResponse.status === 404) {
        const createResponse = await fetch('/api/nutrition/daily', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, date: today, total_calories: 0 }), // total_calories will be updated by triggers/rollup
        });
        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(`Failed to create daily nutrition record: ${errorData.error || 'Unknown error'}`);
        }
        const createdDailyData = await createResponse.json();
        dailyNutritionId = createdDailyData.id;
      } else if (dailyResponse.ok) {
        const existingDailyData = await dailyResponse.json();
        // If API returns an array, take the first one, otherwise assume it's a single object
        dailyNutritionId = Array.isArray(existingDailyData) ? existingDailyData[0]?.id : existingDailyData?.id;
        if(!dailyNutritionId) throw new Error('Failed to retrieve existing daily nutrition ID.');
      } else {
        const errorData = await dailyResponse.json();
        throw new Error(`Failed to fetch daily nutrition record: ${errorData.error || 'Unknown error'}`);
      }

      // 2. Fetch food details from external API
      const foodDetailsResponse = await fetch('/api/nutrition', { // This is the Nutritionix proxy
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: foodName, type: 'nutrients' }),
      });
      if (!foodDetailsResponse.ok) {
        throw new Error('Failed to fetch food details from external API.');
      }
      const foodDetailsData = await foodDetailsResponse.json();

      if (foodDetailsData.foods && foodDetailsData.foods.length > 0) {
        const foodApiItem = foodDetailsData.foods[0];
        const newFoodEntry: Omit<Food, 'id' | 'created_at' | 'updated_at'> = { // Supabase handles id and timestamps
          daily_nutrition_id: dailyNutritionId,
          food_name: foodApiItem.food_name,
          calories: Math.round(foodApiItem.nf_calories || 0),
          protein: Math.round(foodApiItem.nf_protein || 0),
          carbs: Math.round(foodApiItem.nf_total_carbohydrate || 0),
          fat: Math.round(foodApiItem.nf_total_fat || 0),
          image_url: foodApiItem.photo?.highres || foodApiItem.photo?.thumb, // Fallback to thumb if highres not available
          consumed_at: new Date().toISOString(),
        };

        // 3. Save the new food entry
        const consumedResponse = await fetch('/api/nutrition/consumed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFoodEntry),
        });

        if (!consumedResponse.ok) {
          const errorData = await consumedResponse.json();
          throw new Error(`Failed to add consumed food: ${errorData.error || 'Unknown error'}`);
        }
        
        toast({ title: 'Food Added', description: `${newFoodEntry.food_name} has been added.` });
        // Refresh data after adding, with mutation context
        const todayStr = new Date().toISOString().split('T')[0];
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const startDateStr = sevenDaysAgo.toISOString().split('T')[0];
        await fetchDailyData(startDateStr, todayStr, { isMutationUpdate: true });

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        // Fetch weekly/monthly silently in the background
        fetchWeeklyData(undefined, { isMutationUpdate: true }); 
        fetchMonthlyData(currentMonth, currentYear, { isMutationUpdate: true }); 
      } else {
        throw new Error('No food details found for the given name.');
      }
    } catch (error) {
      toast({
        title: 'Error Adding Food',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsMutatingFoodLog(false);
    }
  };

  const deleteFoodEntry = async (foodId: string) => {
    setIsMutatingFoodLog(true);
    if (!user?.id) {
      toast({ title: 'Error', description: 'User not authenticated.', variant: 'destructive' });
      return;
    }
    try {
      const response = await fetch(`/api/nutrition/consumed/${foodId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete food: ${errorData.error || 'Unknown error'}`);
      }

      toast({ title: 'Food Deleted', description: 'The food item has been removed.' });
      // Refresh data after deleting, with mutation context
      const todayStr = new Date().toISOString().split('T')[0];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const startDateStr = sevenDaysAgo.toISOString().split('T')[0];
      await fetchDailyData(startDateStr, todayStr, { isMutationUpdate: true });

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      // Fetch weekly/monthly silently in the background
      fetchWeeklyData(undefined, { isMutationUpdate: true });
      fetchMonthlyData(currentMonth, currentYear, { isMutationUpdate: true }); 
    } catch (error) {
      toast({
        title: 'Error Deleting Food',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsMutatingFoodLog(false);
    }
  };
  
  const refreshAllData = useCallback(async () => {
    const today = new Date();
    const currentEndDateString = today.toISOString().split('T')[0];
    const dailyStartDate = new Date(today);
    dailyStartDate.setDate(today.getDate() - 6);
    const dailyStartDateString = dailyStartDate.toISOString().split('T')[0];
    
    // Fetch all three in parallel
    await Promise.all([
      fetchDailyData(dailyStartDateString, currentEndDateString),
      fetchWeeklyData(currentEndDateString), // Fetches week ending today
      fetchMonthlyData(today.getMonth() + 1, today.getFullYear()) // Fetches current month
    ]);
  }, [fetchDailyData, fetchWeeklyData, fetchMonthlyData]);

  // Initial data load for daily view
  useEffect(() => {
    if (user?.id) {
      // Initial load for all data types
      refreshAllData();
    }
    // Clear data on user change (logout)
    return () => {
      setTrackedFoods([]);
      setHistoricalDailyData([]);
      setWeeklyData(null);
      setMonthlyData(null);
      setTotalCaloriesToday(0);
    }
  }, [user?.id, refreshAllData]);

  return {
    trackedFoods,
    historicalDailyData,
    weeklyData,
    monthlyData,
    totalCaloriesToday,
    isLoadingDaily,
    isLoadingWeekly,
    isLoadingMonthly,
    isMutatingFoodLog, // Added new loading state
    errorDaily,
    errorWeekly,
    errorMonthly,
    addFoodEntry,
    deleteFoodEntry,
    fetchDailyData,
    fetchWeeklyData,
    fetchMonthlyData,
    refreshAllData,
  };
}
