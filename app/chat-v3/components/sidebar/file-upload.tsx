'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { DocumentManagerDialog } from './document-manager-dialog';
import { UploadIcon } from '../icons';

export function FileUpload() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const uploadToast = toast.loading('Uploading file...', {
      description: file.name,
    });

    try {
      const response = await fetch('/api/rag/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast.success('Success!', {
        id: uploadToast,
        description: 'File uploaded successfully.',
      });
    } catch (error) {
      toast.error('Error',
        {
          id: uploadToast,
          description: 'Could not upload file.',
        }
      );
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <span className="mr-2">
              <UploadIcon />
            </span>
            My Documents
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Uploaded Documents</h4>
              <p className="text-sm text-muted-foreground">
                Manage your documents for RAG.
              </p>
            </div>
            <div className="grid gap-2">
              <Button onClick={handleUploadClick}>Upload New File</Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.txt,.md,.docx"
              />
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                Manage Documents
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <DocumentManagerDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
