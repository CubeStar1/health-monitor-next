"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { DocumentPreview } from "./document-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import ReactMarkdown from 'react-markdown';

interface RecordDetailsProps {
  record: {
    id: string;
    user_id: string;
    file_name: string;
    display_name: string;
    created_at: string;
    object_id: string | null;
    analysis?: {
      text_content: string;
      confidence_level: string;
      test_locations: any;
      languages: string[];
      ocr_quality: number;
      indicators: Array<{
        name: string;
        value: string;
        status: string;
        normal_range: string;
        interpretation: string;
      }>;
      clinicalSignificance: string;
    };
    fileUrl: string | null;
  }
}

export function RecordDetails({ record }: RecordDetailsProps) {
  const {
    indicators = [],
    clinicalSignificance = '',
    languages = [],
    ocr_quality = 0,
    text_content = '',
    confidence_level = ''
  } = record.analysis || {};

  return (
    <div className="mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/health/records" 
            className="hover:opacity-80 p-2 rounded-full hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold truncate max-w-[300px] sm:max-w-[500px]">
              {record.file_name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Uploaded on {new Date(record.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* {record.analysis && (
            <Badge 
              variant={
                record.analysis.confidence_level === 'High' ? 'success' :
                record.analysis.confidence_level === 'Medium' ? 'default' : 'secondary'
              }
              className="h-6 px-3 text-sm"
            >
              {record.analysis.confidence_level} Confidence
            </Badge>
          )} */}
          <Link href="/chat">
            <RainbowButton>
              Chat with Document <ChevronRight className="ml-2" />
            </RainbowButton>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="indicators" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="indicators">Indicators & Analysis</TabsTrigger>
          <TabsTrigger value="details">Document & Transcript</TabsTrigger>
        </TabsList>

        <TabsContent value="indicators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {indicators.length > 0 ? (
                indicators.map((indicator, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{indicator.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Normal Range: {indicator.normal_range}
                        </p>
                      </div>
                      <Badge variant={indicator.status === "Abnormal" ? "destructive" : "secondary"}>
                        {indicator.value}
                      </Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "60%" }} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No test results available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Interpretation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {indicators.length > 0 ? (
                indicators.map((indicator, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium text-lg">{indicator.name}</h3>
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <span className="font-medium text-sm text-muted-foreground">Observed Value:</span>
                        <span className="text-sm">{indicator.value}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium text-sm text-muted-foreground">Reference Range:</span>
                        <span className="text-sm">{indicator.normal_range}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium text-sm text-muted-foreground">Interpretation:</span>
                        <span className="text-sm">{indicator.interpretation}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No interpretations available</p>
              )}

              <div className="pt-4 border-t">
                <h3 className="font-medium text-lg mb-2">Clinical Significance</h3>
                <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>
                    {clinicalSignificance || 'No clinical significance available'}
                  </ReactMarkdown>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            {/* Left Column - Transcript */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  {record.analysis?.text_content ? (
                    <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                      {record.analysis.text_content}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No transcript available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview and Details */}
            <div className="space-y-6">
              <Card className="lg:h-fit lg:sticky lg:top-6">
                <CardHeader>
                  <CardTitle>Document Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <DocumentPreview
                    fileName={record.file_name}
                    fileUrl={record.fileUrl}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>File Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h3 className="font-medium text-muted-foreground">Type</h3>
                      <p className="mt-1">{record.file_name.split('.').pop()?.toUpperCase()}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">Display Name</h3>
                      <p className="mt-1">{record.display_name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {record.analysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Languages Detected</h3>
                      <div className="flex gap-2 flex-wrap">
                        {languages.length > 0 ? (
                          languages.map((lang, i) => (
                            <Badge key={i} variant="secondary">
                              {lang}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">No languages detected</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">OCR Quality</h3>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 bg-accent rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${ocr_quality * 10}%` }}
                          />
                        </div>
                        <span className="text-sm">{ocr_quality}/10</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 