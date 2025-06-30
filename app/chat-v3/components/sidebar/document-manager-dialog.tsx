'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface Document {
  id: string;
  file_name: string;
  status: string;
  updated_at: string;
}

interface DocumentManagerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const getStatusVariant = (status: string): 'destructive' | 'default' => {
  if (status === 'failed') {
    return 'destructive';
  }
  return 'default';
};

const getStatusColorClass = (status: string) => {
  switch (status) {
    case 'ready':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200/50 dark:border-green-800/50';
    case 'failed':
      return ''; // Uses destructive variant
    case 'pending':
    case 'partitioning':
    case 'partitioned':
    case 'refined':
    case 'chunked':
    case 'indexed':
    case 'summary_indexed':
    case 'keyword_indexed':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/50';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export function DocumentManagerDialog({ isOpen, onOpenChange }: DocumentManagerDialogProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/rag/status');
      if (!response.ok) {
        throw new Error('Failed to fetch document statuses.');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
      const interval = setInterval(fetchDocuments, 60*60*60*1000); // Poll every 60 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Document Manager</DialogTitle>
          <DialogDescription>
            View the status of your uploaded documents. Statuses refresh automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid gap-4">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <Card key={doc.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium truncate pr-2">
                          {doc.file_name}
                        </CardTitle>
                        <Badge
                          variant={getStatusVariant(doc.status)}
                          className={`capitalize ${getStatusColorClass(doc.status)}`}
                        >
                          {doc.status.replace(/_/g, ' ')}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Last updated: {new Date(doc.updated_at).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">
                    No documents have been uploaded yet.
                  </p>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
