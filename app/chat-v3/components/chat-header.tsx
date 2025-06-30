"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { headerConfig } from "@/lib/config/header";
import { PanelLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/global/theme-switcher";
import { memo } from "react";
import Link from "next/link";

interface ChatHeaderProps {
  chatId: string;
}

function PureChatHeader({ chatId }: ChatHeaderProps) {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex items-center p-4 border-b">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className=""
          onClick={() => toggleSidebar()}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 flex items-center justify-center">
        {headerConfig.navigationLinks.map((link) => (
          <Link href={link.href} key={link.href} className="px-2 py-1 hover:underline">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center">
        <ModeToggle />
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
