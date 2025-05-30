import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LLMSelector } from "@/components/global/llm-selector"
import { ConversationList } from './conversation-list'

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  llmChoice: string;
  handleLlmChange: (value: string) => void;
  conversations: any[];
  currentConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  onRenameConversation: (conversationId: string, title: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  activeTab: 'chat' | 'medical';
  setActiveTab: (tab: 'chat' | 'medical') => void;
}

export function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  llmChoice,
  handleLlmChange,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onDeleteConversation,
  activeTab,
  setActiveTab
}: SidebarProps) {
  return (
    <>
      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setIsSidebarOpen(true)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      <ScrollArea className={`${isSidebarOpen ? 'w-full sm:w-80' : 'w-0'} transition-all duration-300 ease-in-out overflow-y-auto flex-shrink-0`}>
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Configure Chat</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="mb-4">
                <Button
                  variant={activeTab === 'chat' ? 'default' : 'outline'}
                  className="w-full mb-2"
                  onClick={() => setActiveTab('chat')}
                >
                  Chat
                </Button>
                <Button
                  variant={activeTab === 'medical' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setActiveTab('medical')}
                >
                  Medical Search
                </Button>
              </div>
              {activeTab === 'chat' && (
                <>
                  <LLMSelector value={llmChoice} onChange={handleLlmChange} />
                  <ConversationList
                    conversations={conversations}
                    currentConversationId={currentConversationId}
                    onSelectConversation={onSelectConversation}
                    onNewConversation={onNewConversation}
                    onRenameConversation={onRenameConversation}
                    onDeleteConversation={onDeleteConversation}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </ScrollArea>
    </>
  )
}