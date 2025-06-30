"use client";

import { Message } from "ai";
import { memo } from "react";
import { PreviewMessage, ThinkingMessage } from "./message";
import { useScrollToBottom } from "./use-scroll-to-bottom";
import { ToolResultDisplay } from "./tool-result-display";

interface MessagesProps {
  isLoading: boolean;
  messages: Message[];
}

function PureMessages({
  isLoading,
  messages,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom(messages);

  return (
    <div
      ref={messagesContainerRef as React.RefObject<HTMLDivElement>}
      className="flex flex-col min-w-0 gap-6 flex-1 pt-4"
    >
      {messages.map((message, index) => (
        <div key={message.id || index}>
          {/* Render tool invocations if they exist */}
          {message.toolInvocations && message.toolInvocations.map((toolCall) => (
            <div key={toolCall.toolCallId} className="">
              <ToolResultDisplay toolCall={toolCall} />
            </div>
          ))}
          
          {/* Render the message content */}
          {message.content && (
            <PreviewMessage
              message={message}
              isLoading={isLoading && index === messages.length - 1 && !message.toolInvocations}
            />
          )}
        </div>
      ))}

      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <ThinkingMessage />
      )}

      <div ref={messagesEndRef as React.RefObject<HTMLDivElement>} />
    </div>
  );
}

export const Messages = memo(PureMessages);