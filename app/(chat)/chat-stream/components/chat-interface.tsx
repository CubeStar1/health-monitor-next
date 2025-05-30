import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StreamChatInterfaceProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  messages: any[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  samplePrompts: string[];
}

export function StreamChatInterface({
  isSidebarOpen,
  setIsSidebarOpen,
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  samplePrompts,
}: StreamChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  console.log(messages);

  return (
    <div className="flex-grow overflow-hidden">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between px-2 py-0 md:p-4">
          <CardTitle className="hidden md:block">Streaming Chat</CardTitle>
          {!isSidebarOpen && (
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-2 md:p-4">
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto scrollbar-hide">
              {messages.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-bold mb-4">How can I help you today?</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {samplePrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-left h-auto py-2 px-4"
                        onClick={() => handleInputChange({ target: { value: prompt } } as any)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, index) => (
                  <div key={index} className="mb-4">
                    <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3 rounded-lg ${
                        m.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
                      }`}>
                        {m.role === 'assistant' ? (
                          <div className="overflow-hidden">
                            <ReactMarkdown 
                              className="prose prose-sm max-w-none break-words overflow-wrap-anywhere"
                              components={{
                                p: ({node, ...props}) => <p className="mb-2" {...props} />,
                                pre: ({node, ...props}) => <pre className="overflow-x-auto" {...props} />,
                                code: ({node, ...props}) => <code className="text-xs" {...props} />
                              }}
                            >
                              {m.content.split('[SQL_QUERY]')[0].trim()}
                            </ReactMarkdown>
                            {m.tabular_data && m.tabular_data.length > 0 && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="mt-2 w-full"
                                  >
                                    Show Results
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[80vw] max-h-[80vh] overflow-auto p-4 gap-0">
                                  <DialogHeader>
                                    <DialogTitle>Query Results</DialogTitle>
                                  </DialogHeader>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        {Object.keys(m.tabular_data[0]).map((key) => (
                                          <TableHead key={key}>{key}</TableHead>
                                        ))}
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {m.tabular_data.map((row: any, rowIndex: number) => (
                                        <TableRow key={rowIndex}>
                                          {Object.values(row).map((value: any, cellIndex: number) => (
                                            <TableCell key={cellIndex}>{value as string}</TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </DialogContent>
                              </Dialog>
                            )}
                            {m.content.includes('[SQL_QUERY]') && (
                              <div className="mt-2 p-2 bg-white rounded-md">
                                <strong>Executed Query:</strong>
                                <pre className="mt-1 p-2 bg-gray-200 rounded-md overflow-x-auto text-sm">
                                  <code>{m.content.split('[SQL_QUERY]')[1].split('[/SQL_QUERY]')[0].trim()}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="break-words overflow-wrap-anywhere">{m.content}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-2 mt-1">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a question..."
                className="flex-grow"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Send'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}