"use client"

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { PDFViewer } from '@/app/(app)/health/reports/components/pdf-viewer'
import { useRouter } from 'next/navigation'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface HealthReport {
  id: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  report_content?: string
  error_message?: string
  created_at: string
  completed_at?: string
}

export default function ReportPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [report, setReport] = useState<HealthReport | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchReport = useCallback(async () => {
    const { data, error } = await supabase
      .from('health_reports')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch report",
        variant: "destructive",
      })
      return
    }

    setReport(data)
    setLoading(false)
  }, [params.id, toast])

  useEffect(() => {
    fetchReport()
    
    // Subscribe to changes for this specific report
    const channel = supabase
      .channel(`report_${params.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_reports',
          filter: `id=eq.${params.id}`,
        },
        (payload) => {
          fetchReport()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [params.id, fetchReport])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Report not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-1 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-0 sm:mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.push('/health/reports')}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
        <div>
          <h1 className="hidden sm:block text-xl sm:text-2xl font-bold">Health Report</h1>
          {report.completed_at && (
            <p className="text-xs sm:text-sm text-gray-500">
              Generated on {new Date(report.completed_at).toLocaleDateString('en-IN')} at{' '}
              {new Date(report.completed_at).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-2 sm:p-6">
          {report.status === 'generating' && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm text-gray-500">Generating report...</p>
            </div>
          )}
          {report.status === 'failed' && (
            <p className="text-red-500 mb-4">Error: {report.error_message}</p>
          )}
          {report.report_content && (
            <PDFViewer content={report.report_content} />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 