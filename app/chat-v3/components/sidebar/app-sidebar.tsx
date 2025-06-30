"use client";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusIcon } from "../icons";
import { useConversationsContext } from "../../hooks/conversations-context";
import { SidebarHistory } from "./sidebar-history";
import { FileUpload } from "./file-upload";
import { SidebarUserNav } from "./sidebar-user-nav";
import Image from "next/image"
import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface AppSidebarProps {
  user: User | null;
}
export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { createConversation } = useConversationsContext();
  const appName = process.env.NEXT_PUBLIC_APP_NAME!;
  const appIcon = process.env.NEXT_PUBLIC_APP_ICON!;
  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center px-4 py-2">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <Image
                src="/idea-lab-round.png"
                alt="idea-lab-round"
                width={40}
                height={40}
                className="h-10 w-10 "
                />
              <span className="text-md font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Health Monitor
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* <Link href="/chat"> */}
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={async () => {
                    setOpenMobile(false);
                    if (!user) return;
                    const newConv = await createConversation(user.id, "New Chat");
                    if (newConv) {
                      router.push(`/chat-v3/${newConv.id}`);
                    }
                  }}
                >
                  <PlusIcon />
                </Button>
                {/* </Link> */}

              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>

      <SidebarFooter>
        <FileUpload />
        {user && <SidebarUserNav user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
