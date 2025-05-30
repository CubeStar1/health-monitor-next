import { useMedicalSummary } from '@/hooks/use-medical-summary';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';

export function MedicalSummary({ className }: { className?: string }) {
  const { data: medicalSummary, isLoading } = useMedicalSummary();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          View Medical Summary
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px]">
        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading medical history...</span>
            </div>
          ) : (
            <div className="p-4">
              <ReactMarkdown 
                className="prose dark:prose-invert max-w-none"
                components={{
                  h1: ({node, ...props}) => <h1 {...props} className="text-xl font-bold mb-4" />,
                  h2: ({node, ...props}) => <h2 {...props} className="text-lg font-semibold mb-3" />,
                  p: ({node, ...props}) => <p {...props} className="mb-2" />,
                  ul: ({node, ...props}) => <ul {...props} className="list-disc pl-4 mb-2" />,
                  li: ({node, ...props}) => <li {...props} className="mb-1" />
                }}
              >
                {medicalSummary || 'No medical history available.'}
              </ReactMarkdown>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
} 