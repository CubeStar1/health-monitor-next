"use client";

import { useCallback, useState } from "react";
import { CodeIcon, LoaderIcon, PlayIcon } from "./icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}
export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [output, setOutput] = useState<string | null>(null);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeContent = String(children).replace(/\n$/, "");
  const [tab, setTab] = useState<"code" | "run">("code");
  if (!inline) {
    return (
      <div className="not-prose flex flex-col w-full my-4">
        <div className="relative">
          <pre
            {...props}
            className={cn(
              "text-sm w-full overflow-x-auto p-4 rounded-xl font-mono",
              "bg-zinc-50 dark:bg-zinc-800/70",
              "border border-zinc-200 dark:border-zinc-700",
              "text-zinc-800 dark:text-zinc-100",
            )}
          >
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <div className="text-xs text-muted-foreground hidden group-hover:block">
                {language}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  navigator.clipboard.writeText(codeContent);
                }}
              >
                <CodeIcon size={14} />
              </Button>
            </div>
            <code className="whitespace-pre-wrap break-words">{children}</code>
          </pre>
        </div>
      </div>
    );
  }
  return (
    <code
      className={cn(
        "text-sm bg-zinc-100 dark:bg-zinc-800/70 py-0.5 px-1.5 rounded-md font-mono",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}
