import { NextResponse } from 'next/server';
import { createSupabaseBrowser } from '@/lib/supabase/client';

const supabase = createSupabaseBrowser();

export async function POST(request: Request) {
  const { user_id, date, total_calories } = await request.json();

  const { data, error } = await supabase
    .from('daily_nutrition')
    .upsert({ user_id, date, total_calories }, { onConflict: 'user_id,date' })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data[0]);  
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  let query = supabase
    .from('daily_nutrition')
    .select('*, consumed_foods(*)')
    .eq('user_id', user_id);

  if (startDate && endDate) {
    query = query.gte('date', startDate).lte('date', endDate);
  } else if (startDate) { // Fetch from startDate onwards if no endDate
    query = query.gte('date', startDate);
  } else if (endDate) { // Fetch up to endDate if no startDate (less common for this use case)
    query = query.lte('date', endDate);
  } else {
    // If no date range, perhaps default to today or return error? For now, let's expect a range or specific date.
    // For this specific revamp, we'll ensure frontend sends a range.
    // However, if a single 'date' param is provided (legacy or specific use case), handle it:
    const singleDate = searchParams.get('date');
    if (singleDate) {
      query = query.eq('date', singleDate);
      const { data, error } = await query.single();
      if (error) {
        if (error.code === 'PGRST116') { // Not found
          return NextResponse.json(null, { status: 404 });
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json(data);
    }
    // If no date, startDate, or endDate, it's an invalid request for range fetching
    return NextResponse.json({ error: 'Missing date, or startDate and endDate for range' }, { status: 400 });
  }

  query = query.order('date', { ascending: true }); // Ensure data is ordered for charts

  const { data, error } = await query;

  if (error) {
    // PGRST116 is for .single() not found, may not apply directly here for range queries
    // but good to keep general error handling.
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // If data is null (no records found for the range), return an empty array or null based on preference.
  // Empty array is often better for frontend to map over.
  return NextResponse.json(data || []);
}