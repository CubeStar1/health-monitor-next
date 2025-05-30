"use client"

import { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, Download, Loader2 } from "lucide-react"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import { format } from 'date-fns'

interface Document {
  id: string
  document_type: string
  file_name: string
  file_url: string
  doctor_name: string
  patient_name: string
  hospital_name: string
  created_at: string
  document_date: string
}

export const DocumentList = forwardRef<{ fetchDocuments: () => Promise<void> }, {}>(
  (_, ref) => {
    const [documents, setDocuments] = useState<Document[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchDocuments = async () => {
      const supabase = createSupabaseBrowser()
      
      const { data, error } = await supabase
        .from('sample_medical_documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching documents:', error)
        return
      }

      setDocuments(data || [])
      setIsLoading(false)
    }

    useImperativeHandle(ref, () => ({
      fetchDocuments
    }))

    useEffect(() => {
      fetchDocuments()
    }, [])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    if (documents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold">No documents found</h3>
          <p className="text-sm text-gray-500">Generate some documents to see them here.</p>
        </div>
      )
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Type</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="capitalize">
                  {doc.document_type.replace('_', ' ')}
                </TableCell>
                <TableCell>{doc.patient_name}</TableCell>
                <TableCell>{doc.doctor_name}</TableCell>
                <TableCell>{doc.hospital_name}</TableCell>
                <TableCell>
                  {format(new Date(doc.document_date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.file_url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
)

DocumentList.displayName = 'DocumentList' 