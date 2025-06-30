"use client";

import { useChat } from '@ai-sdk/react'; // Update import to support RSC and handle streamed UI components
import { Messages } from "./messages";
import { MultimodalInput } from "./multimodal-input";
import { ChatHeader } from "./chat-header";
import { Message } from "ai";
import { saveMessages } from "../actions";
import { useState } from "react";
import { models } from "@/lib/ai/providers";

interface ChatProps {
  id: string;
  initialMessages?: Message[];
}

export function Chat({ id, initialMessages = [] }: ChatProps) {
  const [selectedModel, setSelectedModel] = useState(models[0].value);
  const { messages, input, setInput, handleInputChange, handleSubmit, status, data, append } = useChat({
    initialMessages,
    api: '/api/chat-v3',
    onFinish: async (message) => {
      // Save the completed assistant message
      if (message.role === 'assistant') {
        await saveMessages([message], id);
      }
    },
    onError: async (error) => {
      console.error("Error fetching response:", error);
    },
    experimental_prepareRequestBody: (body) => {
      return {
        ...body,
        selectedModel,
      };
    },
  });

  // Custom submit handler to make chat feel snappy
  const customHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = input.trim();
    if (!content) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    // Append message to UI and send to API
    append(userMessage);

    // Clear input
    setInput('');

    // Save message to DB in background
    saveMessages([userMessage], id);
  };

  return (
    <div className="relative flex-1 flex flex-col h-full bg-background">
      <ChatHeader chatId={id} />
      <div className="flex-1 overflow-auto">
        <Messages
          isLoading={status === 'submitted'}
          messages={messages}
        />
      </div>
      <div className="sticky bottom-0 bg-gradient-to-t from-background to-transparent">
        <div className="mx-auto max-w-3xl px-4 pb-4">
          <MultimodalInput
            chatId={id}
            messages={messages}
            append={append}
            value={input}
            onChange={handleInputChange}
            handleSubmit={customHandleSubmit}
            isLoading={status === 'submitted'}
            modelState={{
              selectedModel,
              setSelectedModel,
            }}
          />
        </div>
      </div>
    </div>
  );
}
