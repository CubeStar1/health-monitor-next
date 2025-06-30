import { tool } from 'ai';
import { z } from 'zod';
import supabaseAdmin from '@/lib/supabase/admin';

export const querySupabaseTool = tool({
  description: 'Query the Supabase database.',
  parameters: z.object({
    query: z.string().describe('The SQL query to execute.'),
  }),
  execute: async function ({ query }: { query: string }) {
    const supabase = supabaseAdmin();
    console.log(query);
    // Remove trailing semicolon to prevent syntax errors
    const sanitizedQuery = query.trim().replace(/;$/, '');
    const { data, error } = await supabase.rpc('execute_sql', { query: sanitizedQuery });

    if (error) {
      console.error('Supabase query error:', error);
      return JSON.stringify({ error: `Error running query: ${error.message}` });
    }

    if (!data) {
      return JSON.stringify({ result: "Query returned no results." });
    }

    return JSON.stringify(data);
  },
});
