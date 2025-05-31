import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import {
  DailyNutritionRecord,
  MonthlyNutritionSummary,
  AggregatedNutrientSummary,
  FoodFrequencySummary,
  FoodCalorieSummary,
  WeeklyAverageCalorieSummary,
  Food,
  DailyCalorieSummary
} from '@/app/(app)/health/nutrition/types';

// Helper function to get all dates in a month
function getDatesInMonth(month: number, year: number): Date[] {
  const date = new Date(year, month - 1, 1);
  const dates: Date[] = [];
  while (date.getMonth() === month - 1) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

// Helper function to get week number in month (simple version)
function getWeekOfMonth(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  // Adjust to make week start on Monday for calculation if desired, or use ISO week
  const dayOfMonth = date.getDate();
  return Math.ceil((dayOfMonth + (dayOfWeek === 0 ? 6 : dayOfWeek -1) -1 ) / 7); 
}

export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const monthParam = searchParams.get('month');
  const yearParam = searchParams.get('year');

  if (!userId || !monthParam || !yearParam) {
    return NextResponse.json({ error: 'User ID, month, and year are required' }, { status: 400 });
  }

  const month = parseInt(monthParam, 10);
  const year = parseInt(yearParam, 10);

  if (isNaN(month) || month < 1 || month > 12 || isNaN(year)) {
    return NextResponse.json({ error: 'Invalid month or year' }, { status: 400 });
  }

  try {
    const formatLocalDate = (d: Date): string => {
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, '0'); // getMonth is 0-indexed
      const day = d.getDate().toString().padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const startDateString = formatLocalDate(firstDayOfMonth);
    const endDateString = formatLocalDate(lastDayOfMonth);
    const daysInMonth = lastDayOfMonth.getDate();

    const { data: dailyRecords, error: dailyError } = await supabase
      .from('daily_nutrition')
      .select('*, consumed_foods(*)')
      .eq('user_id', userId)
      .gte('date', startDateString)
      .lte('date', endDateString)
      .order('date', { ascending: true });

    if (dailyError) {
      console.error('Error fetching monthly nutrition data:', dailyError);
      throw dailyError;
    }

    const allDatesInMonth = getDatesInMonth(month, year);
    const dailyBreakdown: DailyCalorieSummary[] = allDatesInMonth.map(d => ({
        date: formatLocalDate(d),
        calories: 0
    }));

    if (!dailyRecords || dailyRecords.length === 0) {
      return NextResponse.json({
        month,
        year,
        averageDailyCalories: 0,
        nutrientTotals: { totalProtein: 0, totalCarbs: 0, totalFat: 0 },
        topFoodsByFrequency: [],
        topFoodsByCalories: [],
        dailyBreakdown: dailyBreakdown, // Full month, all zeros
        weeklyAverageBreakdown: [] // Or pre-fill with zeros if structure is fixed
      } as MonthlyNutritionSummary, { status: 200 });
    }

    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalCaloriesSum = 0;
    const allFoods: Food[] = [];

    const recordsMap = new Map<string, DailyNutritionRecord>();
    dailyRecords.forEach((r: any) => recordsMap.set(r.date, r as DailyNutritionRecord));

    dailyBreakdown.forEach(daySummary => {
        const record = recordsMap.get(daySummary.date);
        if (record) {
            let dayCalories = 0;
            record.consumed_foods.forEach(food => {
                totalProtein += food.protein || 0;
                totalCarbs += food.carbs || 0;
                totalFat += food.fat || 0;
                dayCalories += food.calories || 0;
                allFoods.push(food);
            });
            daySummary.calories = dayCalories;
            totalCaloriesSum += dayCalories;
        }
    });

    const nutrientTotals: AggregatedNutrientSummary = {
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
    };

    const foodFrequency: { [key: string]: number } = {};
    allFoods.forEach(food => {
      foodFrequency[food.food_name] = (foodFrequency[food.food_name] || 0) + 1;
    });
    const topFoodsByFrequency: FoodFrequencySummary[] = Object.entries(foodFrequency)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const foodCalories: { [key: string]: number } = {};
    allFoods.forEach(food => {
      foodCalories[food.food_name] = (foodCalories[food.food_name] || 0) + food.calories;
    });
    const topFoodsByCalories: FoodCalorieSummary[] = Object.entries(foodCalories)
      .map(([name, tc]) => ({ name, totalCalories: Math.round(tc) }))
      .sort((a, b) => b.totalCalories - a.totalCalories)
      .slice(0, 5);

    const averageDailyCalories = Math.round(totalCaloriesSum / daysInMonth);

    // Calculate weekly average breakdown
    const weeklyAverageBreakdown: WeeklyAverageCalorieSummary[] = [];
    const weeks: { [weekNum: number]: { calories: number[], count: number, startDate?: Date, endDate?: Date } } = {};

    allDatesInMonth.forEach(dateObj => {
        const weekNum = getWeekOfMonth(dateObj);
        if (!weeks[weekNum]) {
            weeks[weekNum] = { calories: [], count: 0, startDate: dateObj };
        }
        const record = recordsMap.get(dateObj.toISOString().split('T')[0]);
        weeks[weekNum].calories.push(record ? record.consumed_foods.reduce((sum, f) => sum + f.calories, 0) : 0);
        weeks[weekNum].count++;
        weeks[weekNum].endDate = dateObj; // Keep updating end date
    });

    for (const weekNumStr in weeks) {
        const weekNum = parseInt(weekNumStr);
        const weekData = weeks[weekNum];
        const weeklyTotalCals = weekData.calories.reduce((sum, cal) => sum + cal, 0);
        weeklyAverageBreakdown.push({
            weekNumber: weekNum,
            weekStartDate: weekData.startDate!.toISOString().split('T')[0],
            weekEndDate: weekData.endDate!.toISOString().split('T')[0],
            averageCalories: weekData.count > 0 ? Math.round(weeklyTotalCals / weekData.count) : 0,
        });
    }
    weeklyAverageBreakdown.sort((a,b) => a.weekNumber - b.weekNumber);

    const monthlySummary: MonthlyNutritionSummary = {
      month,
      year,
      averageDailyCalories,
      nutrientTotals,
      topFoodsByFrequency,
      topFoodsByCalories,
      dailyBreakdown, // Full daily breakdown for the month
      weeklyAverageBreakdown,
    };

    return NextResponse.json(monthlySummary, { status: 200 });
  } catch (error) {
    console.error('Error in /api/nutrition/monthly:', error);
    return NextResponse.json({ error: 'Failed to fetch monthly nutrition data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
