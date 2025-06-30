"use client";

// The component for rendering the Supabase query results as a table
export function SupabaseQuery({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-zinc-500">No data returned from the query.</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
        <thead className="bg-zinc-50 dark:bg-zinc-800">
          <tr>
            {headers.map(header => (
              <th key={header} scope="col" className="px-4 py-2 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map(header => (
                <td key={header} className="px-4 py-2 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                  {typeof row[header] === 'object' ? JSON.stringify(row[header]) : String(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
