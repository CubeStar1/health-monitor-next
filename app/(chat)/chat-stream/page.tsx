'use client'

import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { StreamSidebar } from './components/sidebar';
import { StreamChatInterface } from './components/chat-interface';
import useUser from '../../../hooks/use-user';
import { Message, Conversation } from '../chat/types';
import { useToast } from '@/hooks/use-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ChatStreamPage() {
  const [model, setModel] = useState('openai');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const { data: user } = useUser();
  const { toast } = useToast();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleChatSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: `${API_URL}/chat`,
    streamProtocol: 'text',
    body: { 
      model: model,
      conversationId: currentConversationId,
      userId: user?.id,
      stream: true,
      db_credentials: {
        db_user: process.env.NEXT_PUBLIC_DB_USER,
        db_password: process.env.NEXT_PUBLIC_DB_PASSWORD,
        db_host: process.env.NEXT_PUBLIC_DB_HOST,
        db_port: process.env.NEXT_PUBLIC_DB_PORT,
        db_name: process.env.NEXT_PUBLIC_DB_NAME,
      },
    },
    onFinish: async (message) => {
      if (currentConversationId && user?.id) {
        await insertMessage({
          role: 'assistant',
          content: message.content,
        }, currentConversationId, user.id);
        
        await updateConversationTimestamp(currentConversationId, user.id);
        
        fetchConversations();
      }
    },
  });

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversationId) {
      fetchMessages(currentConversationId);
    }
  }, [currentConversationId]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/chat-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetchConversations', data: { userId: user.id } }),
      });
      
      if (!response.ok) {
        throw new Error('Error fetching conversations');
      }
      
      const data = await response.json();
      setConversations(data);
      if (data.length > 0 && !currentConversationId) {
        setCurrentConversationId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch conversations. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchMessages = async (conversationId: string) => {
    if (!user) return;
    try {
      const response = await fetch('/api/chat-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetchMessages', data: { conversationId, userId: user.id } }),
      });
      
      if (!response.ok) {
        throw new Error('Error fetching messages');
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const insertMessage = async (message: Message, conversationId: string, userId: string) => {
    try {
      await fetch('/api/chat-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'insertMessage', 
          data: { 
            message, 
            conversationId, 
            userId 
          } 
        }),
      });
    } catch (error) {
      console.error('Error inserting message:', error);
      toast({
        title: "Error",
        description: "Failed to save the message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentConversationId || !user?.id) return;

    try {
      await insertMessage(
        { role: 'user', content: input },
        currentConversationId,
        user.id
      );

      await handleChatSubmit(e);

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "An error occurred while processing your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateConversationTimestamp = async (conversationId: string, userId: string) => {
    try {
      await fetch('/api/chat-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'updateConversationTimestamp', 
          data: { conversationId, userId } 
        }),
      });
    } catch (error) {
      console.error('Error updating conversation timestamp:', error);
    }
  };

  const handleModelChange = (value: string) => {
    setModel(value);
  };

  const handleNewConversation = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/chat-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createConversation', data: { title: 'New Conversation', userId: user.id } }),
      });
      
      if (!response.ok) {
        throw new Error('Error creating new conversation');
      }
      
      const data = await response.json();
      fetchConversations();
      setCurrentConversationId(data.id);
      setMessages([]);
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create a new conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  const handleRenameConversation = async (conversationId: string, title: string) => {
    try {
      const response = await fetch('/api/chat-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'renameConversation', data: { conversationId, title, userId: user?.id } }),
      });

      if (!response.ok) {
        throw new Error('Error renaming conversation');
      }

      fetchConversations();
    } catch (error) {
      console.error('Error renaming conversation:', error);
      toast({
        title: "Error",
        description: "Failed to rename the conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch('/api/chat-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteConversation', data: { conversationId, userId: user?.id } }),
      });

      if (!response.ok) {
        throw new Error('Error deleting conversation');
      }

      fetchConversations();
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete the conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const samplePrompts = [
    "How many calories did I eat yesterday?",
    "How many steps did I walk today?",
    "What was my heart rate yesterday?",
    "What was my weight yesterday?",
  ];

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden gap-0 mx-auto sm:gap-2 md:h-[calc(100vh-120px)]">
      <StreamSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        model={model}
        handleModelChange={handleModelChange}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      <StreamChatInterface
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        samplePrompts={samplePrompts}
      />
    </div>
  );
}