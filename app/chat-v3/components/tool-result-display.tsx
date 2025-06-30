"use client";

import React, { useRef, useEffect, memo } from 'react';

import { ToolInvocation } from "ai";
import { motion, AnimatePresence } from 'framer-motion';
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

const TOOL_COLORS: { [key: string]: { bg: string; text: string; line: string; dot: string } } = {
  querySupabase: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-300",
    line: "bg-blue-500",
    dot: "bg-blue-500"
  },
  generateChart: {
    bg: "bg-green-50 dark:bg-green-950/20",
    text: "text-green-700 dark:text-green-300",
    line: "bg-green-500",
    dot: "bg-green-500"
  },
  tavilySearch: {
    bg: "bg-red-50 dark:bg-red-950/20", 
    text: "text-red-700 dark:text-red-300",
    line: "bg-red-500",
    dot: "bg-red-500"
  },
  ragRetrieval: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    text: "text-purple-700 dark:text-purple-300",
    line: "bg-purple-500",
    dot: "bg-purple-500"
  },
  generateImage: {
    bg: "bg-orange-50 dark:bg-orange-950/20",
    text: "text-orange-700 dark:text-orange-300",
    line: "bg-orange-500",
    dot: "bg-orange-500"
  },
  sendHealthReport: {
    bg: "bg-cyan-50 dark:bg-cyan-950/20",
    text: "text-cyan-700 dark:text-cyan-300",
    line: "bg-cyan-500",
    dot: "bg-cyan-500"
  },
};

interface ToolResultDisplayProps {
  toolCall: ToolInvocation;
  isLast?: boolean;
  isFirst?: boolean;
  totalTools?: number;
  currentIndex?: number;
}

// Animated timeline connector component
const TimelineConnector = ({ 
  isActive, 
  color, 
  isLast = false, 
  delay = 0 
}: { 
  isActive: boolean; 
  color: string; 
  isLast?: boolean; 
  delay?: number;
}) => {
  return (
    <div className="relative w-full flex-grow">
      {!isLast && (
        <motion.div
          className={`w-0.5 h-full mx-auto ${isActive ? color : 'bg-gray-200 dark:bg-gray-700'}`}
          initial={{ scaleY: 0, opacity: 0.3 }}
          animate={{ 
            scaleY: isActive ? 1 : 0.3, 
            opacity: isActive ? 1 : 0.3 
          }}
          transition={{ 
            duration: 0.8, 
            delay: delay,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: 'top' }}
        />
      )}
    </div>
  );
};

// Animated dot component
const TimelineDot = ({ 
  isActive, 
  isCompleted, 
  hasError, 
  color, 
  delay = 0 
}: { 
  isActive: boolean; 
  isCompleted: boolean; 
  hasError: boolean; 
  color: string; 
  delay?: number;
}) => {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      {/* Pulsing background for active state */}
      <AnimatePresence>
        {isActive && !isCompleted && (
          <motion.div
            className={`absolute w-4 h-4 rounded-full ${color} opacity-30`}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.5, 1] }}
            exit={{ scale: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Main dot */}
      <motion.div
        className={`w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 ${
          hasError 
            ? 'bg-red-500' 
            : isCompleted 
              ? color 
              : isActive 
                ? color 
                : 'bg-gray-300 dark:bg-gray-600'
        }`}
        animate={{
          scale: isActive && !isCompleted ? [1, 1.1, 1] : 1
        }}
        transition={{
          duration: 1.5,
          repeat: isActive && !isCompleted ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
      
      {/* Completion checkmark */}
      <AnimatePresence>
        {isCompleted && !hasError && (
          <motion.div
            className="absolute"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <CheckCircle2 className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error indicator */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            className="absolute"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <AlertCircle className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// The main component that decides what to render based on the tool call
function ToolResultDisplayInternal({ 
  toolCall, 
  isLast = false, 
  isFirst = false,
  totalTools = 1,
  currentIndex = 0
}: ToolResultDisplayProps) {
  if (!TOOL_DISPLAY_NAMES[toolCall.toolName]) {
    return null;
  }

  const toolDisplayName = TOOL_DISPLAY_NAMES[toolCall.toolName];
  const ToolIcon = TOOL_ICONS[toolCall.toolName];
  const colors = TOOL_COLORS[toolCall.toolName];
  
  const isLoading = toolCall.state === 'call';
  const isCompleted = toolCall.state === 'result';
  const isActive = isLoading || isCompleted;

  const hasAnimatedIn = useRef(false);
  const hasShownResult = useRef(false);

  useEffect(() => {
    if (isActive) {
      hasAnimatedIn.current = true;
    }
    if (isCompleted) {
      hasShownResult.current = true;
    }
  }, [isActive, isCompleted]);
  
  let data;
  let hasError = false;
  
  if (isCompleted) {
    try {
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

  const animationDelay = currentIndex * 0.2;

  return (
    <div className="max-w-3xl w-full mx-auto">
      <div className="flex items-stretch gap-4">
        {/* Enhanced Timeline */}
        <div className="flex flex-col items-center">
          <TimelineDot
            isActive={isActive}
            isCompleted={isCompleted}
            hasError={hasError}
            color={colors.dot}
            delay={animationDelay}
          />
          <TimelineConnector
            isActive={isActive}
            color={colors.line}
            isLast={isLast}
            delay={animationDelay + 0.3}
          />
        </div>

        {/* Content */}
        <div className="flex-1 pb-4 max-w-2xl">
          <motion.div
            initial={hasAnimatedIn.current ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: animationDelay }}
          >
            {/* Tool Status Badge */}
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${colors.bg} ${colors.text} shadow-sm`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : hasError ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : (
                <ToolIcon className="w-4 h-4" />
              )}
              <span>{toolDisplayName}</span>
              {isLoading && (
                <motion.div
                  className="flex gap-1 ml-2"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-1 h-1 bg-current rounded-full" />
                  <div className="w-1 h-1 bg-current rounded-full" />
                  <div className="w-1 h-1 bg-current rounded-full" />
                </motion.div>
              )}
            </motion.div>

            {/* Loading State */}
            {isLoading && (
              <motion.div
                className="mt-3 text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: animationDelay + 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`w-2 h-2 rounded-full ${colors.dot}`}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span>Processing request...</span>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {hasError && (
              <motion.div
                className="mt-3"
                initial={hasShownResult.current ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: animationDelay + 0.2 }}
              >
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Error occurred</span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{data?.error}</p>
                </div>
              </motion.div>
            )}

            {/* Success State with Results */}
            {isCompleted && !hasError && (
              <motion.div
                className="mt-3"
                initial={hasShownResult.current ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: animationDelay + 0.3 }}
              >
                <Accordion type="single" collapsible className="w-full" >
                  <AccordionItem value={toolCall.toolCallId} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <AccordionTrigger className="hover:no-underline px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors [&>svg]:hidden">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                        <ToolIcon className="w-4 h-4" />
                        <span>View Results</span>
                        <span className="text-xs">• {toolDisplayName} completed successfully</span>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="p-2">
                      <div className="space-y-4">
                        {/* Nested Function Details */}
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={`${toolCall.toolCallId}-details`} className="border border-gray-100 dark:border-gray-800 rounded-lg">
                            <AccordionTrigger className="hover:no-underline px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/30">
                              <div className="flex items-center gap-2">
                                <FunctionSquareIcon className="w-4 h-4 text-gray-500" />
                                <span className="font-mono text-sm">{toolCall.toolName}</span>
                                <span className="text-gray-400">Function Details</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-3 pb-3">
                              <div className="space-y-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Code2 className="w-4 h-4 text-gray-500" />
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                      Parameters
                                    </h4>
                                  </div>
                                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                    <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-x-auto">
                                      <code>{JSON.stringify(toolCall.args, null, 2)}</code>
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        {/* Main Results */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                              Results
                            </h4>
                          </div>

                          <div>
                            {toolCall.toolName === 'querySupabase' && <SupabaseQuery data={data} />}
                            {toolCall.toolName === 'generateChart' && <ChartDisplay {...data} />}
                            {toolCall.toolName === 'tavilySearch' && <TavilySearchResult data={data} />}
                            {toolCall.toolName === 'ragRetrieval' && <RagResultDisplay chunks={data.chunks} />}
                            {toolCall.toolName === 'generateImage' && <ImageDisplay {...data} />}
                            {toolCall.toolName === 'sendHealthReport' && <SendHealthReportDisplay data={data} />}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export const ToolResultDisplay = memo(ToolResultDisplayInternal);

// Wrapper component for handling multiple tool calls
export function ToolResultsContainer({ toolCalls }: { toolCalls: ToolInvocation[] }) {
  const validToolCalls = toolCalls.filter(call => TOOL_DISPLAY_NAMES[call.toolName]);
  
  return (
    <div className="space-y-0">
      {validToolCalls.map((toolCall, index) => (
        <ToolResultDisplay
          key={toolCall.toolCallId}
          toolCall={toolCall}
          isFirst={index === 0}
          isLast={index === validToolCalls.length - 1}
          totalTools={validToolCalls.length}
          currentIndex={index}
        />
      ))}
    </div>
  );
}