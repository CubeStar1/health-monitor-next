"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Message } from "ai";
import { memo } from "react";
import { saveMessages } from "../actions";
interface SuggestedActionsProps {
  chatId: string;
  append: (message: Message) => Promise<string | null | undefined>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
function PureSuggestedActions({
  chatId,
  append,
  handleSubmit,
}: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "Analyze Heart Rate Trends",
      label: "Analyze and visualize my heart rate over the past 6 months",
      action:
        "Plot my average heart rate over the past few months please use efficent queries since theres a lot of data, I want month wise averages. Also provide insights about heart rate conditions and health metrics.",
    },
    {
      title: "Analyze Medical Records",
      label: "Review recent medical records",
      action:
        "Analyze the latest medical records data and provide insights about medical conditions and health metrics.",
    },
    {
      title: "Visually Analyze Sensor Data",
      label: "Compare heart rate and blood pressure data",
      action:
        "Compare recent heart rate and blood pressure data to identify patterns and correlations.",
    },
    {
      title: "Analyze nutrition logs",
      label: "Analyze nutrition logs",
      action:
        "Analyze historical nutrition data to identify trends and patterns over time.",
    },
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full pb-2">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 20,
          }}
          transition={{
            delay: 0.05 * index,
          }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              const userMessage: Message = {
                id: crypto.randomUUID(),
                role: 'user',
                content: suggestedAction.action,
              };
              await saveMessages([userMessage], chatId);
              await append(userMessage);
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm gap-1 sm:flex-col w-full h-auto justify-start items-start sm:items-stretch"
          >
            <span className="font-medium truncate">{suggestedAction.title}</span>
            <span className="text-muted-foreground truncate">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
export const SuggestedActions = memo(PureSuggestedActions, () => true);
