'use client';

import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { PlusIcon } from '../icons';
import { SidebarHistory } from './sidebar-history';
import { SidebarUserNav } from './sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LLMSelector } from '@/components/global/llm-selector';
import Image from 'next/image';
import { NavProfile } from '@/components/navigation/nav-profile';

interface AppSidebarProps {
  user: User | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center px-4 py-2">
          <div className="py-4 border-b flex items-center gap-2">
            <Image src="/idea-lab-round.png" alt="Logo" width={40} height={40} />
            <h1 className="text-sm font-semibold">Health Monitor</h1>
          </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/chat-new');
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
          <div className="px-4 py-2">
            <LLMSelector value="openai" onChange={() => {}} />
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>

      <SidebarFooter>
        <NavProfile user={user} />
      </SidebarFooter>
    </Sidebar>
  );
} 