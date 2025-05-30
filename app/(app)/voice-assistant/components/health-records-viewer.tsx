import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Loader2 } from 'lucide-react';
import { useHealthRecords } from '@/hooks/use-health-records';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function HealthRecordsViewer({ className }: { className?: string }) {
  const { data: records, isLoading } = useHealthRecords();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          View Medical Records
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading records...</span>
            </div>
          ) : records?.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No health records found
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {records?.map((record) => (
                <Link 
                  key={record.id} 
                  href={`/health/records/${record.id}`}
                >
                  <div className={cn(
                    "flex items-center",
                    "hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors",
                    "cursor-pointer"
                  )}>
                    <div className="flex items-center space-x-4">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {record.displayName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
} 