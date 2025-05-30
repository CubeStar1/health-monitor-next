"use client";

import React, { useState, useEffect } from 'react';
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Menu, Edit2, Trash2, Calendar, ChevronDown } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChatButton } from './components/chat-button';
import { User } from '@supabase/supabase-js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { UploadButton } from './components/upload-button';

type TranscriptionStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface FileInfo {
  id: string;
  name: string;
  displayName: string;
  created_at: string;
  status?: TranscriptionStatus;
  error_message?: string | null;
}

interface HealthRecordsPageClientProps {
  initialData: {
    user: User | null;
    files: FileInfo[];
  }
}

export default function HealthRecordsPageClient({ initialData }: HealthRecordsPageClientProps) {
  const [files, setFiles] = useState<FileInfo[]>(initialData.files);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const { toast } = useToast();
  const supabase = createSupabaseBrowser();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleUploadSuccess = (fileName: string, displayName: string, fileId: string) => {
    setFiles(prevFiles => [...prevFiles, { 
      id: fileId, 
      name: fileName, 
      displayName, 
      created_at: new Date().toISOString() 
    }]);
    toast({
      title: "Success",
      description: "File uploaded successfully",
      variant: "default",
    });
  };

  const handleDownload = async (fileName: string) => {
    if (!initialData.user?.id) return;
    
    const { data, error } = await supabase.storage
      .from('health-records')
      .download(`${initialData.user.id}/${fileName}`);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    } else if (data) {
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    }
  };

  const getFileUrl = async (fileName: string) => {
    if (!initialData.user?.id) return null;

    const { data, error } = await supabase.storage
      .from('health-records')
      .createSignedUrl(`${initialData.user.id}/${fileName}`, 3600); 

    if (error) {
      toast({
        title: "Error",
        description: "Failed to generate file URL",
        variant: "destructive",
      });
      return null;
    }

    return data.signedUrl;
  };

  const handleRename = async (fileId: string, newName: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file || !initialData.user?.id) return;

    const fileExtension = file.name.split('.').pop();
    const newDisplayName = `${newName}.${fileExtension}`;

    const { error } = await supabase
      .from('file_metadata')
      .upsert({ 
        user_id: initialData.user.id, 
        file_name: file.name, 
        display_name: newDisplayName 
      }, { 
        onConflict: 'user_id,file_name' 
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to rename file",
        variant: "destructive",
      });
      console.error(error);
    } else {
      setFiles(files.map(f => f.id === fileId ? {...f, displayName: newDisplayName} : f));
      setEditingFile(null);
      toast({
        title: "Success",
        description: "File renamed successfully",
        variant: "default",
      });
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!initialData.user?.id) return;

    try {
      // Delete from file_metadata first - this will cascade to other tables
      const { error: metadataError } = await supabase
        .from('file_metadata')
        .delete()
        .match({ 
          user_id: initialData.user.id, 
          file_name: fileName
        });

      if (metadataError) {
        console.error('Metadata deletion error:', metadataError);
        toast({
          title: "Error",
          description: "Failed to delete file metadata",
          variant: "destructive",
        });
        return;
      }

      // Then delete from storage
      const { error: storageError } = await supabase.storage
        .from('health-records')
        .remove([`${initialData.user.id}/${fileName}`]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        toast({
          title: "Error",
          description: "Failed to delete file from storage",
          variant: "destructive",
        });
        return;
      }

      // Update UI
      setFiles(files.filter(f => f.id !== fileId));

      toast({
        title: "Success",
        description: "File deleted successfully",
        variant: "default",
      });

    } catch (error) {
      console.error('Delete operation failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete file completely",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: TranscriptionStatus = 'pending') => {
    const statusConfig: Record<TranscriptionStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'destructive' }> = {
      pending: { label: 'Pending', variant: 'secondary' },
      processing: { label: 'Processing', variant: 'default' },
      completed: { label: 'Completed', variant: 'success' },
      failed: { label: 'Failed', variant: 'destructive' },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  useEffect(() => {
    // Initial status check for all files
    const checkInitialStatuses = async () => {
      if (!initialData.user?.id) return;

      const { data, error } = await supabase
        .from('transcriptions')
        .select('file_id, status, error_message')
        .in('file_id', files.map(f => f.id));
      
      if (data) {
        setFiles(prevFiles => 
          prevFiles.map(file => {
            const transcription = data.find(t => t.file_id === file.id);
            return transcription 
              ? { ...file, status: transcription.status, error_message: transcription.error_message }
              : { ...file, status: 'pending' };
          })
        );
      }
    };
    checkInitialStatuses();

    // Subscribe to status updates
    const subscription = supabase
      .channel(`transcriptions`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transcriptions',
        },
        (payload: any) => {
          const { file_id, status, error_message } = payload.new;
          
          setFiles(prevFiles => 
            prevFiles.map(file => 
              file.id === file_id 
                ? { ...file, status, error_message }
                : file
            )
          );
          
          if (status === 'completed') {
            toast({
              title: "Processing Complete",
              description: `File has been successfully processed.`,
              variant: "default",
            });
          } else if (status === 'failed') {
            toast({
              title: "Processing Failed",
              description: error_message || "An error occurred during processing",
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, files.map(f => f.id).join(','), initialData.user?.id, toast]);

  if (!initialData.user) return null;

  return (
    <div className="relative min-h-screen bg-background">
      <main className="flex-1 px-4 py-6 md:px-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Health Records</h1>
          </div>

          {/* Filters Section */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 bg-card border rounded-md p-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Start date → End date"
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="blood-test">Blood Test</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Records List */}
          <div className="space-y-3">
            {files.map((file) => (
              <Link
                key={file.id}
                href={`/health/records/${file.id}`}
                className="block"
              >
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-muted-foreground">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base truncate">
                        {editingFile === file.id ? (
                          <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                            <Input 
                              value={newFileName.split('.')[0]}
                              onChange={(e) => setNewFileName(e.target.value + '.' + file.displayName.split('.').pop())}
                              className="w-64"
                            />
                            <Button onClick={() => handleRename(file.id, newFileName.split('.')[0])}>
                              Save
                            </Button>
                          </div>
                        ) : (
                          file.displayName
                        )}
                      </h3>
                      <div className="flex flex-col gap-1 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>Status:</span>
                          {getStatusBadge(file.status)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Upload Date:</span>
                          <span>{format(new Date(file.created_at), 'dd MMM, HH:mm a')}</span>
                        </div>
                      </div>
                    </div>

                    <div 
                      className="flex items-center gap-2"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(file.name)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setEditingFile(file.id);
                          setNewFileName(file.displayName);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your file.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(file.id, file.name)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <UploadButton 
        user={initialData.user!} 
        onUploadSuccess={handleUploadSuccess}
      />
      <ChatButton />
    </div>
  );
}