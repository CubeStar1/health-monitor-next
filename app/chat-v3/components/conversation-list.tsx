"use client";

import { useParams } from "next/navigation";
import { Conversation } from "@/app/chat-v3/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, PencilEditIcon, TrashIcon } from "./icons";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onDeleteConversation: (id: string) => void;
}
export function ConversationList({
  conversations,
  onSelectConversation,
  onRenameConversation,
  onDeleteConversation,
}: ConversationListProps) {
  const params = useParams();
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  return (
    <div className="flex flex-col gap-2 p-2">
      {conversations.map((conversation) => (
        <div key={conversation.id} className="flex items-center gap-2">
          <Button
            variant={conversation.id === params.id ? "secondary" : "ghost"}
            className="w-full justify-start text-left"
            onClick={() => onSelectConversation(conversation.id)}
          >
            {conversation.title}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setRenameId(conversation.id);
                  setRenameTitle(conversation.title);
                }}
              >
                <PencilEditIcon size={16} />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDeleteConversation(conversation.id)}
              >
                <TrashIcon size={16} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog
            open={renameId === conversation.id}
            onOpenChange={() => setRenameId(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename Conversation</DialogTitle>
              </DialogHeader>
              <Input
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                placeholder="Enter new title"
              />
              <Button
                onClick={() => {
                  if (renameId) {
                    onRenameConversation(renameId, renameTitle);
                  }
                  setRenameId(null);
                }}
              >
                Save
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
}
