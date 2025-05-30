import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LLMSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function LLMSelector({ value, onChange }: LLMSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select LLM Model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="openai">OpenAI GPT-4o-mini</SelectItem>
        <SelectItem value="gemini">Gemini 1.5 Flash</SelectItem>
        <SelectItem value="local">Llama 3.2 8B - Fine-tuned</SelectItem>
      </SelectContent>
    </Select>
  );
}