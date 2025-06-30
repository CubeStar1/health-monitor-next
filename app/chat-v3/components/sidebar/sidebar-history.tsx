"use client";

import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { memo, useEffect } from "react";
import { toast } from "sonner";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar";
import { useConversationsContext } from "../../hooks/conversations-context";
import { MoreHorizontalIcon, PencilEditIcon, TrashIcon } from "../icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Conversation } from "@/app/chat-v3/types";
type GroupedChats = {
  today: Conversation[];
  yesterday: Conversation[];
  lastWeek: Conversation[];
  lastMonth: Conversation[];
  older: Conversation[];
};
const PureChatItem = ({
  chat,
  isActive,
  onRename,
  onDelete,
  setOpenMobile,
}: {
  chat: Conversation;
  isActive: boolean;
  onRename: (chatId: string, title: string) => void;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={`/chat-v3/${chat.id}`} onClick={() => setOpenMobile(false)}>
          <span>{chat.title}</span>
        </Link>
      </SidebarMenuButton>

      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
            showOnHover={!isActive}
          >
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem
            onClick={() => {
              setIsRenaming(true);
              setNewTitle(chat.title);
            }}
          >
            <PencilEditIcon size={16} />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/15 focus:text-destructive"
            onClick={() => onDelete(chat.id)}
          >
            <TrashIcon size={16} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter new title"
          />
          <Button
            onClick={() => {
              onRename(chat.id, newTitle);
              setIsRenaming(false);
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  );
};
export const ChatItem = memo(PureChatItem);
export function SidebarHistory({ user }: { user: User | null }) {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();
  const {
    conversations,
    fetchConversations,
    renameConversation,
    deleteConversation,
  } = useConversationsContext();
  useEffect(() => {
    if (!user) return;

    // initial load
    fetchConversations(user.id);


  }, [user, fetchConversations]);
  useEffect(() => {
    console.log("Conversations loaded:", conversations.length); // Debug log
  }, [conversations]);
  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            Login to save and revisit previous chats!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }
  if (!conversations || conversations.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }
  const groupChatsByDate = (chats: Conversation[]): GroupedChats => {
    const now = new Date();
    const oneWeekAgo = subWeeks(now, 1);
    const oneMonthAgo = subMonths(now, 1);
    return chats.reduce(
      (groups, chat) => {
        const chatDate = new Date(chat.updated_at);
        if (isToday(chatDate)) {
          groups.today.push(chat);
        } else if (isYesterday(chatDate)) {
          groups.yesterday.push(chat);
        } else if (chatDate > oneWeekAgo) {
          groups.lastWeek.push(chat);
        } else if (chatDate > oneMonthAgo) {
          groups.lastMonth.push(chat);
        } else {
          groups.older.push(chat);
        }
        return groups;
      },
      {
        today: [],
        yesterday: [],
        lastWeek: [],
        lastMonth: [],
        older: [],
      } as GroupedChats,
    );
  };
  const groupedChats = groupChatsByDate(conversations);
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {groupedChats.today.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                Today
              </div>
              {groupedChats.today.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === id}
                  onRename={renameConversation}
                  onDelete={deleteConversation}
                  setOpenMobile={setOpenMobile}
                />
              ))}
            </>
          )}

          {groupedChats.yesterday.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6">
                Yesterday
              </div>
              {groupedChats.yesterday.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === id}
                  onRename={renameConversation}
                  onDelete={deleteConversation}
                  setOpenMobile={setOpenMobile}
                />
              ))}
            </>
          )}

          {groupedChats.lastWeek.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6">
                Last Week
              </div>
              {groupedChats.lastWeek.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === id}
                  onRename={renameConversation}
                  onDelete={deleteConversation}
                  setOpenMobile={setOpenMobile}
                />
              ))}
            </>
          )}

          {groupedChats.lastMonth.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6">
                Last Month
              </div>
              {groupedChats.lastMonth.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === id}
                  onRename={renameConversation}
                  onDelete={deleteConversation}
                  setOpenMobile={setOpenMobile}
                />
              ))}
            </>
          )}

          {groupedChats.older.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6">
                Older
              </div>
              {groupedChats.older.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === id}
                  onRename={renameConversation}
                  onDelete={deleteConversation}
                  setOpenMobile={setOpenMobile}
                />
              ))}
            </>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
