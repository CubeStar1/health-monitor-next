"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Maximize2, X } from "lucide-react"
import { useState } from "react"

interface DocumentPreviewProps {
  fileName: string
  fileUrl: string | null
}

export function DocumentPreview({ fileName, fileUrl }: DocumentPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fileExtension = fileName.split('.').pop()?.toLowerCase()

  const renderPreview = () => {
    if (!fileUrl) return <p className="text-center py-4">Preview not available</p>

    switch (fileExtension) {
      case 'pdf':
        return (
          <iframe 
            src={fileUrl} 
            className="w-full h-[400px] rounded-lg" 
          />
        )
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <img 
            src={fileUrl} 
            alt={fileName} 
            className="w-full h-[400px] object-contain rounded-lg" 
          />
        )
      default:
        return <p className="text-center py-4">Preview not available for this file type.</p>
    }
  }

  return (
    <div className="relative">
      {/* Direct preview */}
      <div className="min-h-[400px] bg-muted/30 rounded-lg overflow-hidden">
        {renderPreview()}
      </div>
      
      {/* Fullscreen dialog trigger */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <div className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background border-b">
            <DialogTitle className="text-lg font-semibold">
              {fileName}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 overflow-auto" style={{ height: 'calc(95vh - 60px)' }}>
            {fileExtension === 'pdf' ? (
              <iframe 
                src={fileUrl || ''} 
                className="w-full h-full rounded-lg" 
                style={{ minHeight: '800px' }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <img 
                  src={fileUrl || ''} 
                  alt={fileName}
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 