"use client";

import React, { useState, useRef } from 'react';
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

interface UploadButtonProps {
  user: User;
  onUploadSuccess: (fileName: string, displayName: string, fileId: string) => void;
}

export function UploadButton({ user, onUploadSuccess }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const supabase = createSupabaseBrowser();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
        if (!fileName) {
          setFileName(file.name);
        }
      } else {
        toast({
          title: "Error",
          description: "Please select a PDF or image file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      toast({
        title: "Error",
        description: "Please select a file to upload and ensure you're logged in",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const uniqueFileName = `${Date.now()}_${selectedFile.name}`;
    const displayName = fileName || selectedFile.name;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('health-records')
        .upload(`${user.id}/${uniqueFileName}`, selectedFile);

      if (uploadError) throw uploadError;

      const { data: metadataData, error: metadataError } = await supabase
        .from('file_metadata')
        .insert({ 
          user_id: user.id, 
          file_name: uniqueFileName, 
          display_name: displayName 
        })
        .select()
        .single();

      if (metadataError) throw metadataError;

      onUploadSuccess(uniqueFileName, displayName, metadataData.id);
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
        variant: "default",
      });

      // Close the sheet after successful upload
      setIsOpen(false);
      
      // Start transcription process
      transcribeFile(metadataData.id, uniqueFileName, selectedFile);

    } catch (error) {
      console.error('Error during upload:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setFileName('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const transcribeFile = async (fileId: string, uniqueFileName: string, file: File) => {
    try {
      let requestBody;
      
      if (file.type === 'application/pdf') {
        const { data, error } = await supabase
          .storage
          .from('health-records')
          .createSignedUrl(`${user.id}/${uniqueFileName}`, 600);

        if (error) throw error;
        if (!data?.signedUrl) throw new Error('Failed to generate signed URL');

        requestBody = {
          file_url: data.signedUrl,
          file_id: fileId,
          user_id: user.id
        };
      } else {
        const fileContent = await file.arrayBuffer();
        const uint8Array = new Uint8Array(fileContent);
        const base64File = btoa(uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), ''));

        requestBody = {
          file: base64File,
          file_name: uniqueFileName,
          file_id: fileId,
          user_id: user.id
        };
      }

      const endpoint = file.type === 'application/pdf' ? 'analyze-pdf' : 'analyze-image';

      const analysisResponse = await fetch(`${imageUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!analysisResponse.ok) {
        throw new Error(`HTTP error! status: ${analysisResponse.status}`);
      }
    } catch (error) {
      console.error('Error during transcription:', error);
      toast({
        title: "Transcription Error",
        description: `Failed to transcribe file "${uniqueFileName}". Please try again later.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="lg" className="rounded-full h-14 px-6 shadow-lg">
            <Upload className="h-5 w-5 mr-2" />
            Upload Record
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[300px]">
          <SheetHeader>
            <SheetTitle>Upload Health Record</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <Input
              type="text"
              placeholder="File name (optional)"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
            <Input
              type="file"
              onChange={handleFileSelect}
              disabled={isUploading}
              ref={fileInputRef}
              accept="application/pdf,image/*"
            />
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || !selectedFile}
              className="w-full"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 