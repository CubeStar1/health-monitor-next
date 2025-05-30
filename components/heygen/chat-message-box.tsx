import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon } from "@/app/chat-new/components/icons";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageBoxProps {
  messages: Message[];
}

export function ChatMessageBox({ messages }: ChatMessageBoxProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <p>Start a conversation with the avatar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <AnimatePresence key={index}>
              <motion.div
                className="w-full mx-auto group/message"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                data-role={message.role}
              >
                <div className={cn(
                  'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
                  {
                    'w-full': true,
                    'group-data-[role=user]/message:w-fit': true
                  },
                )}>
                  {message.role === 'assistant' && (
                    <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
                      <div className="translate-y-px">
                        <SparklesIcon size={14} />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-row gap-2 items-start">
                      <div className={cn('flex flex-col gap-4 rounded-xl px-3 py-2', {
                        'bg-primary text-primary-foreground ml-auto': message.role === 'user',
                      })}>
                        <ReactMarkdown
                          className={cn("text-sm prose max-w-none", {
                            'dark:prose-invert': message.role === 'assistant',
                            'prose-invert': message.role === 'user'
                          })}
                          components={{
                            p: ({ children }) => <p className="mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="my-0">{children}</ul>,
                            ol: ({ children }) => <ol className="my-0">{children}</ol>,
                            li: ({ children }) => <li className="my-0">{children}</li>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      )}
    </ScrollArea>
  );
} 