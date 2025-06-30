    "use client";

import { Image as ImageIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TavilySearchResponse, TavilySearchResult as TavilySearchResultType } from '@/app/chat-v3/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// The component for rendering the Tavily search results
export function TavilySearchResult({ data }: { data: TavilySearchResponse }) {
  if (!data || !data.results) {
    return <p className="text-sm text-zinc-500">No search results found.</p>;
  }

  return (
    <div className="space-y-4">
      {data.answer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Answer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-700 dark:text-zinc-300">
            <p>{data.answer}</p>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex space-x-4 pb-4">
              {data.results.map((result: TavilySearchResultType, index: number) => (
                <a
                  key={index}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/50 transition-colors w-64 flex-shrink-0 overflow-hidden"
                >
                  <div className="h-32 bg-zinc-200 dark:bg-zinc-800 relative">
                    {data.images && data.images[index] ? (
                      <img
                        src={data.images[index].url}
                        alt={result.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                        <ImageIcon className="size-8 text-zinc-400 dark:text-zinc-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-blue-600 dark:text-blue-400 whitespace-normal text-sm line-clamp-2">{result.title}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-1">{new URL(result.url).hostname}</div>
                  </div>
                </a>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
