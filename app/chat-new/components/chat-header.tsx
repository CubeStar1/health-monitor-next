'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { SidebarToggle } from '@/app/chat-new/components/sidebar/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, VercelIcon } from './icons';
import { useSidebar } from '@/components/ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, Plug } from 'lucide-react';
import { ModeToggle } from '@/components/global/theme-switcher';

function PureChatHeader({
  chatId,
  selectedModelId,
  isReadonly,
  isConnected,
  isConnecting,
  onConnect,
}: {
  chatId: string;
  selectedModelId: string;
  isReadonly: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
              onClick={() => {
                router.push('/chat-new');
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      {!isConnected && (
        <Button
          variant="outline"
          className="order-1 md:order-2 gap-2"
          onClick={onConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden md:inline">Connecting...</span>
            </>
          ) : (
            <>
              <Plug className="h-4 w-4" />
              <span className="hidden md:inline">Connect Data</span>
            </>
          )}
        </Button>
      )}

      <div className="ml-auto">
        <ModeToggle />
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  if (prevProps.selectedModelId !== nextProps.selectedModelId) return false;
  if (prevProps.isConnected !== nextProps.isConnected) return false;
  if (prevProps.isConnecting !== nextProps.isConnecting) return false;
  return true;
});
