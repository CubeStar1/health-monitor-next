"use client";

import { ToolInvocation } from "ai";
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Database, Search, ChevronDown, Code2, CheckCircle2, AlertCircle, Loader2, FileText, BarChart, Image as ImageIcon, Mail } from 'lucide-react';
import { SupabaseQuery } from "./tool-displays/supabase-query";
import { ChartDisplay } from './tool-displays/chart-display';
import { ImageDisplay } from './tool-displays/image-display';
import { TavilySearchResult } from "./tool-displays/tavily-search-result";
import { RagResultDisplay } from './tool-displays/rag-result-display';
import { SendHealthReportDisplay } from './tool-displays/send-health-report-display';
import { FunctionSquareIcon } from "lucide-react";

const TOOL_DISPLAY_NAMES: { [key: string]: string } = {
  querySupabase: "Database Query",
  generateChart: "Chart Generation",
  tavilySearch: "Searching the web",
  ragRetrieval: "Retrieving from Documents",
  generateImage: "Generating Image",
  sendHealthReport: "Sending Health Report",
};

const TOOL_ICONS: { [key: string]: React.ComponentType<{ className?: string }> } = {
  querySupabase: Database,
  generateChart: BarChart,
  tavilySearch: Search,
  ragRetrieval: FileText,
  generateImage: ImageIcon,
  sendHealthReport: Mail,
  };

const TOOL_COLORS: { [key: string]: { bg: string; text: string } } = {
  querySupabase: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-300"
  },
  generateChart: {
    bg: "bg-green-50 dark:bg-green-950/20",
    text: "text-green-700 dark:text-green-300"
  },
  tavilySearch: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20", 
    text: "text-emerald-700 dark:text-emerald-300"
  },
  ragRetrieval: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    text: "text-purple-700 dark:text-purple-300"
  },
  generateImage: {
    bg: "bg-orange-50 dark:bg-orange-950/20",
    text: "text-orange-700 dark:text-orange-300"
  },
  sendHealthReport: {
    bg: "bg-cyan-50 dark:bg-cyan-950/20",
    text: "text-cyan-700 dark:text-cyan-300"
  },
};

// The main component that decides what to render based on the tool call
export function ToolResultDisplay({ toolCall }: { toolCall: ToolInvocation }) {
  if (!TOOL_DISPLAY_NAMES[toolCall.toolName]) {
    return null;
  }

  const toolDisplayName = TOOL_DISPLAY_NAMES[toolCall.toolName];
  const ToolIcon = TOOL_ICONS[toolCall.toolName];
  const colors = TOOL_COLORS[toolCall.toolName];
  
  const isLoading = toolCall.state === 'call';
  const isCompleted = toolCall.state === 'result';
  
  let data;
  let hasError = false;
  
  if (isCompleted) {
    try {
      // The tool result can be a string or an object.
      // If it's a string, parse it. If it's an object, use it directly.
      data = typeof toolCall.result === 'string' 
        ? JSON.parse(toolCall.result) 
        : toolCall.result;
      hasError = !!data.error;
    } catch (e) {
      hasError = true;
      const errorMessage = e instanceof Error ? e.message : String(e);
      data = { error: `Parse error: ${errorMessage}` };
    }
  }

  return (
    <div className="max-w-3xl w-full mx-auto mb-4">
      {/* Animated Timeline indicator */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex flex-col items-center mt-1">
          <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mt-1" />
        </div>
        <div className="flex-1">
          {isLoading && (
            <>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{toolDisplayName}</span>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" />
                  <span>Processing...</span>
                </div>
              </div>
            </>
          )}
          
          {hasError && (
            <>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>{toolDisplayName}</span>
              </div>
              {/* <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Error occurred</span>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{data.error}</p>
              </div> */}
            </>
          )}
          
          {isCompleted && !hasError && (
            <Accordion type="single" collapsible className="w-full" defaultValue={toolCall.toolCallId}>
            {/* <Accordion type="single" collapsible className="w-full" > */}

              <AccordionItem value={toolCall.toolCallId} className="border-none">
                <AccordionTrigger className="hover:no-underline p-0 text-left [&>svg]:hidden">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text} hover:opacity-80 transition-opacity`}>
                    <ToolIcon className="w-4 h-4" />
                    <span>{toolDisplayName}</span>
                  </div>
                </AccordionTrigger>
              <AccordionContent className="pt-4 max-w-3xl">
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={toolCall.toolCallId} className="border-none">
                      <AccordionTrigger className="hover:no-underline p-0 text-left [&>svg]:hidden">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text} hover:opacity-80 transition-opacity`}>
                          <FunctionSquareIcon className="w-4 h-4" />
                          <span>{toolCall.toolName}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 max-w-3xl">
                        {/* Input Section */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-gray-500" />
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        Query Parameters
                      </h4>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-x-auto">
                        <code>{JSON.stringify(toolCall.args, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                    </AccordionContent>
                  </AccordionItem>
                  </Accordion>

                  {/* Result Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        Results
                      </h4>
                    </div>

                        {toolCall.toolName === 'querySupabase' && <SupabaseQuery data={data} />}
                        {toolCall.toolName === 'generateChart' && <ChartDisplay {...data} />}
                        {toolCall.toolName === 'tavilySearch' && <TavilySearchResult data={data} />}
                        {toolCall.toolName === 'ragRetrieval' && <RagResultDisplay chunks={data.chunks} />}
                        {toolCall.toolName === 'generateImage' && <ImageDisplay {...data} />}
                        {toolCall.toolName === 'sendHealthReport' && <SendHealthReportDisplay data={data} />}

                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}