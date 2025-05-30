import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Conversation } from '../types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Pencil, Trash, MoreVertical } from 'lucide-react'

interface ConversationListProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onRenameConversation: (conversationId: string, title: string) => void
  onDeleteConversation: (conversationId: string) => void
}

export function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onDeleteConversation,
}: ConversationListProps) {
  const [renameTitle, setRenameTitle] = useState('')
  const [renameId, setRenameId] = useState<string | null>(null)

  const handleRename = (conversationId: string, title: string) => {
    setRenameId(conversationId)
    setRenameTitle(title)
  }

  const handleRenameSubmit = () => {
    if (renameId) {
      onRenameConversation(renameId, renameTitle)
      setRenameId(null)
      setRenameTitle('')
    }
  }

  return (
    <div className="">
      <Button onClick={onNewConversation} className="w-full mb-2">New Conversation</Button>
      <ScrollArea className="h-full">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="flex items-center mb-1 gap-2">
            <Button
              onClick={() => onSelectConversation(conversation.id)}
              variant={currentConversationId === conversation.id ? "secondary" : "ghost"}
              className="flex-grow justify-start overflow-hidden"
            >
              <span className="truncate">{conversation.title}</span>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleRename(conversation.id, conversation.title)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Rename
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onDeleteConversation(conversation.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </PopoverContent>
            </Popover>
            <Dialog open={renameId === conversation.id} onOpenChange={() => setRenameId(null)}>
              <DialogContent className="flex flex-col p-4 gap-4 max-w-md">
                <DialogHeader>
                  <DialogTitle>Rename Conversation</DialogTitle>
                </DialogHeader>
                <Input
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                />
                <Button onClick={handleRenameSubmit}>Rename</Button>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}