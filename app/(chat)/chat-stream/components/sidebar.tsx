import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'
import { Conversation } from '../../chat/types'
import { ConversationList } from '../../chat/components/conversation-list'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StreamSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  model: string;
  handleModelChange: (value: string) => void;
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onRenameConversation: (conversationId: string, title: string) => void;
  onDeleteConversation: (conversationId: string) => void;
}

export function StreamSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  model,
  handleModelChange,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onDeleteConversation,
}: StreamSidebarProps) {
  return (
    <ScrollArea className={`${isSidebarOpen ? 'w-80 sm:w-80' : 'w-0'} transition-all duration-300 ease-in-out overflow-y-auto flex-shrink-0`}>
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Configure Stream Chat</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="mb-4">
              <Select value={model} onValueChange={handleModelChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={onSelectConversation}
            onNewConversation={onNewConversation}
            onRenameConversation={onRenameConversation}
            onDeleteConversation={onDeleteConversation}
          />
        </CardContent>
      </Card>
    </ScrollArea>
  )
}