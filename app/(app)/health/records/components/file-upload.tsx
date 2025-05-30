"use client"

import React, { useState, useRef } from 'react';
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

interface FileUploadProps {
  user: User;
  onUploadSuccess: (fileName: string, displayName: string, fileId: string) => void;
}

export function FileUpload({ user, onUploadSuccess }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      const { error: uploadError } = await supabase.storage
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

      toast({
        title: "Analysis Complete",
        description: "File has been successfully analyzed.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze file. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <input
        type="file"
        onChange={handleFileSelect}
        disabled={isUploading}
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <Button 
        size="lg"
        onClick={() => fileInputRef.current?.click()}
        className="shadow-lg"
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "+ Add New"}
      </Button>
    </div>
  );
} 