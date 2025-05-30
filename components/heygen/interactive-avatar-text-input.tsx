import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Airplane, ArrowRight, PaperPlaneRight } from "@phosphor-icons/react";
import clsx from "clsx";

interface StreamingAvatarTextInputProps {
  label: string;
  placeholder: string;
  input: string;
  onSubmit: () => void;
  setInput: (value: string) => void;
  endContent?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export default function InteractiveAvatarTextInput({
  label,
  placeholder,
  input,
  onSubmit,
  setInput,
  endContent,
  disabled = false,
  loading = false,
}: StreamingAvatarTextInputProps) {
  function handleSubmit() {
    if (input.trim() === "") {
      return;
    }
    onSubmit();
    setInput("");
  }

  return (
    <div className="relative w-full">
      <Input
        type="text"
        disabled={disabled}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        className="w-full pr-20"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-row items-center">
        {endContent}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <button
                  type="submit"
                  className="focus:outline-none"
                  onClick={handleSubmit}
                  disabled={disabled}
                >
                  <PaperPlaneRight
                    className={clsx(
                      "text-muted-foreground hover:text-foreground transition-colors",
                      disabled && "opacity-50"
                    )}
                    size={24}
                  />
                </button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
