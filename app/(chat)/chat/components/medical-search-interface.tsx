import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Search, Menu, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

interface SearchResult {
  title: string;
  url: string;
  content: string;
  image_url?: string;
}

interface SearchEntry {
  query: string;
  results: SearchResult[];
  report: string;
}

interface MedicalSearchInterfaceProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function MedicalSearchInterface({
  isSidebarOpen,
  setIsSidebarOpen,
}: MedicalSearchInterfaceProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchEntry[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/medical-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setSearchHistory(prev => [...prev, { query, results: data.results, report: data.report }]);
      setQuery('');
    } catch (error) {
      console.error('Medical search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    "What are the symptoms of diabetes?",
    "How to prevent heart disease?",
    "Latest treatments for cancer",
    "Benefits of regular exercise"
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [searchHistory]);

  return (
    <div className="flex-grow overflow-hidden bg-background text-foreground relative max-w-7xl mx-auto">
      <div className="h-full flex flex-col">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Medical Search</h1>
            {!isSidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="flex-grow px-2 pb-24" ref={scrollAreaRef}>
          {searchHistory.length === 0 && (
            <div className="grid grid-cols-2 gap-4">
              {sampleQueries.map((sampleQuery, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-2 px-4"
                  onClick={() => setQuery(sampleQuery)}
                >
                  {sampleQuery}
                </Button>
              ))}
            </div>
          )}

          {searchHistory.map((entry, entryIndex) => (
            <div key={entryIndex} className="mb-8 pb-8 border-b">
              <h2 className="text-xl font-bold mb-4">Q: {entry.query}</h2>
              
              <div className="space-y-6">
                {entry.results.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-2 text-sm text-muted-foreground">Sources</h3>
                    <div className="flex flex-wrap gap-2">
                      {entry.results.map((result, index) => (
                        <a 
                          key={index}
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="no-underline"
                        >
                          <Card className="w-48 h-24 flex flex-col justify-between hover:bg-accent transition-colors duration-200 shadow-md hover:shadow-lg">
                            <CardContent className="p-2">
                              <h4 className="font-semibold text-xs truncate">{result.title}</h4>
                              <div className="text-blue-500 hover:underline text-xs flex items-center mt-1">
                                <ExternalLink size={12} className="mr-1" />
                                {new URL(result.url).hostname}
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {entry.report && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-2 text-lg">Answer</h3>
                    <ReactMarkdown className="prose max-w-none dark:prose-invert">
                      {entry.report}
                    </ReactMarkdown>
                  </div>
                )}
                
                {entry.results.length > 0 && (
                  <div>
                    <h3 className="font-bold mb-2 text-lg">Detailed Results</h3>
                    {entry.results.map((result, index) => (
                      <Card key={index} className="mb-4 shadow-md">
                        <CardContent className="p-4">
                          <h3 className="font-bold mb-2">{result.title}</h3>
                          {result.image_url && (
                            <div className="mb-2">
                              <Image src={result.image_url} alt={result.title} width={200} height={150} objectFit="cover" />
                            </div>
                          )}
                          <p className="mb-2 text-sm">{result.content}</p>
                          <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm flex items-center">
                            <ExternalLink size={14} className="mr-1" />
                            Read more
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t z-10">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a medical question..."
                className="w-full py-3 pl-4 pr-12 rounded-full shadow-md"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Button type="submit" variant="ghost" size="icon" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : <Search className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}