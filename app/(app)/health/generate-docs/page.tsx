"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { DocumentList } from "./components/document-list"

export default function DocumentsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [documentType, setDocumentType] = useState<string>("")
  const [count, setCount] = useState<number>(1)
  const documentListRef = useRef<{ fetchDocuments: () => Promise<void> } | null>(null)

  const handleGenerate = async () => {
    if (!documentType) {
      toast({
        title: "Error",
        description: "Please select a document type",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_type: documentType,
          count: count,
          llm_choice: "openai"
        }),
      })

      const data = await response.json()
      
      if (!response.ok) throw new Error(data.message)

      toast({
        title: "Success",
        description: `Generated ${count} document(s) successfully`,
      })

      // Refresh the document list
      if (documentListRef.current) {
        await documentListRef.current.fetchDocuments()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate documents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Medical Documents</CardTitle>
          <CardDescription>
            Generate sample medical documents for testing purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label>Document Type</label>
            <Select onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="lab_report">Lab Report</SelectItem>
                <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Number of Documents</label>
            <Input
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !documentType}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Documents
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Documents</CardTitle>
          <CardDescription>
            View and download your generated medical documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentList ref={documentListRef} />
        </CardContent>
      </Card>
    </div>
  )
} 