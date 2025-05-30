"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { FileText, Loader2, Grid, List, ExternalLink } from 'lucide-react'
import useUser from '@/hooks/use-user'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface HealthReport {
  id: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  report_content?: string
  error_message?: string
  created_at: string
  completed_at?: string
}

type ViewMode = 'grid' | 'table'

export default function ReportsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [reports, setReports] = useState<HealthReport[]>([])
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null)
  const { toast } = useToast()
  const { data: user } = useUser()
  const router = useRouter()

  const fetchReports = useCallback(async () => {
    const { data, error } = await supabase
      .from('health_reports')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive",
      })
      return
    }

    setReports(data)
  }, [user, toast])

  useEffect(() => {
    if (user) {
      fetchReports()
      
      // Subscribe to changes
      const channel = supabase
        .channel('health_reports')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'health_reports',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchReports()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user, fetchReports])

  const generateNewReport = async () => {
    try {
      const response = await fetch('/api/health-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          llm_choice: 'openai'
        }),
      })

      if (!response.ok) throw new Error('Failed to start report generation')

      toast({
        title: "Success",
        description: "Report generation started",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start report generation",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      generating: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800"
    }[status] || "bg-gray-100 text-gray-800"

    return <Badge className={variants}>{status}</Badge>
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Health Reports</h1>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('table')}
              className={`${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={generateNewReport} className="w-full sm:w-auto">
          <FileText className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {reports.map((report) => (
            <Card 
              key={report.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/health/reports/${report.id}`)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Report
                  {report.status === 'generating' && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="capitalize text-sm font-medium">
                  Status: {report.status}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(report.created_at).toLocaleDateString('en-IN') + ' ' + new Date(report.created_at).toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[160px]">Created</TableHead>
                  <TableHead className="min-w-[160px] hidden sm:table-cell">Completed</TableHead>
                  <TableHead className="hidden sm:table-cell">Generation Time</TableHead>
                  <TableHead className="w-[60px]">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow 
                    key={report.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/health/reports/${report.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(report.status)}
                        {report.status === 'generating' && (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(report.created_at).toLocaleDateString('en-IN') + ' ' + 
                       new Date(report.created_at).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {report.completed_at ? 
                        new Date(report.completed_at).toLocaleDateString('en-IN') + ' ' + 
                        new Date(report.completed_at).toLocaleTimeString() : 
                        '-'
                      }
                    </TableCell>
                    <TableCell>
                      {report.completed_at ? 
                        `${((new Date(report.completed_at).getTime() - 
                           new Date(report.created_at).getTime()) / 1000).toFixed(1)}s` : 
                        '-'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/health/reports/${report.id}`)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  )
}