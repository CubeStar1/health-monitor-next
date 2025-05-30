import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import useUser from '@/hooks/use-user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: user, isLoading: userLoading } = useUser();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    

    try {
      const response = await fetch(`${API_URL}/rag-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: input,
          llm_choice: 'openai', 
          match_count: 5,
          user_id: user?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "An error occurred while processing your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    "How many calories did I eat yesterday?",
    "How many steps did I walk today?",
    "What was my heart rate yesterday?",
    "What was my weight yesterday?",
  ];

  return (
    <>
      <Button
        className="fixed bottom-8 right-8 rounded-full w-12 h-12 p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <MessageSquare />}
      </Button>
      {isOpen && (
        <div className="fixed inset-20 bg-background z-50 flex flex-col max-w-[90%] max-h-[90%]">
          <Card className="flex-grow flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
              <CardTitle className="text-xl">Chat with Your Health Data</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-4 flex flex-col">
              <ScrollArea className="flex-grow pr-4">
                {messages.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold mb-4">How can I help you today?</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {samplePrompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="text-left h-auto py-2 px-4"
                          onClick={() => setInput(prompt)}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div key={index} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3 rounded-lg ${
                        message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.role === 'assistant' ? (
                          <div className="overflow-hidden">
                            <ReactMarkdown 
                              className="prose prose-sm max-w-none break-words overflow-wrap-anywhere"
                              components={{
                                p: ({node, ...props}) => <p className="mb-2" {...props} />,
                                pre: ({node, ...props}) => <pre className="overflow-x-auto" {...props} />,
                                code: ({node, ...props}) => <code className="text-xs" {...props} />
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="break-words overflow-wrap-anywhere">{message.content}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>
              <form onSubmit={handleSubmit} className="flex space-x-2 mt-4">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your health data..."
                  className="flex-grow"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Send'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}