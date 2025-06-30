"use client";

import { FormEvent, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SuggestedActions } from "./suggested-actions";

import { models } from "@/lib/ai/providers";
import { ModelSelector } from "./model-selector";
import { Message } from "ai";

interface MultimodalInputProps {
  chatId: string;
  messages: Message[];
  append: (message: Message) => Promise<string | null | undefined>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  modelState: {
    selectedModel: string;
    setSelectedModel: (model: string) => void;
  };
}

export function MultimodalInput({
  chatId,
  messages,
  append,
  value,
  onChange,
  handleSubmit,
  isLoading,
  modelState,
}: MultimodalInputProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-4"
    >
      
      <div className="relative">
        {messages.length === 0 && (
                <SuggestedActions 
                  append={append} 
                  chatId={chatId} 
                  handleSubmit={handleSubmit}
                />
              )}
        <Textarea
          value={value}
          onChange={onChange}
          placeholder="Send a message..."
          className={cn(
            "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base",
            "bg-muted pb-10 dark:border-zinc-700"
          )}
          rows={2}
          disabled={isLoading}
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />

        <div className="absolute bottom-2 left-2 gap-2">
          <ModelSelector models={models} selectedModel={modelState.selectedModel} setSelectedModel={modelState.setSelectedModel} />
        </div>

        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          {isLoading ? (
            <Button
              type="button"
              className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!value.trim()}
              className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
