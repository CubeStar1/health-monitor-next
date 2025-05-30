'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Sidebar } from './components/chat-sidebar'
import { ChatInterface } from './components/chat-interface'
import { MedicalSearchInterface } from './components/medical-search-interface'
import { Message, Conversation } from './types'
import { User } from '@supabase/supabase-js'
import { createSupabaseBrowser } from "@/lib/supabase/client";

const DB_CREDENTIALS = {
  db_user: "",
  db_password: "",
  db_host: "",
  db_port: "",
  db_name: ""
};

interface ChatPageClientProps {
  initialData: {
    user: User | null;
    conversations: Conversation[];
    messages: Message[];
  }
}

export default function ChatPageClient({ initialData }: ChatPageClientProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialData.messages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast()
  const [llmChoice, setLlmChoice] = useState('openai');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>(initialData.conversations);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    initialData.conversations.length > 0 ? initialData.conversations[0].id : null
  );
  const [useRAG, setUseRAG] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'medical'>('chat');

  const supabase = createSupabaseBrowser();

  useEffect(() => {
    if (initialData.user) {
      handleConnect();
    }
  }, [initialData.user]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/db-structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ db_credentials: DB_CREDENTIALS }),
      });
      if (response.ok) {
        setIsConnected(true);
        toast({
          title: "Connection Successful",
          description: "Successfully connected to the database.",
          variant: "default",
        });
      } else {
        throw new Error('Failed to connect to database');
      }
    } catch (error) {
      console.error('Error connecting to database:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the database. Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentConversationId) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Insert user message into the database
      await supabase
        .from('messages')
        .insert({ conversation_id: currentConversationId, role: 'user', content: input });

      const endpoint = useRAG ? '/api/rag-query' : '/api/chat';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage], 
          dbCredentials: DB_CREDENTIALS, 
          llm_choice: llmChoice,
          conversationId: currentConversationId,
          query: input, // for RAG query
          match_count: 5, // for RAG query
          user_id: initialData.user?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: useRAG ? data.response : data.content,
        tabular_data: data.tabular_data 
      };

      // Insert assistant message into the database
      await supabase
        .from('messages')
        .insert({ conversation_id: currentConversationId, role: 'assistant', content: assistantMessage.content });

      setMessages(prev => [...prev, assistantMessage]);

      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentConversationId);

      await fetchConversations();
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "An error occurred while processing your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLlmChange = (value: string) => {
    setLlmChoice(value);
  };

  const handleNewConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({ title: 'New Conversation', user_id: initialData.user?.id })
        .select()
        .single();

      if (error) throw error;

      await fetchConversations();
      setCurrentConversationId(data.id);
      setMessages([]);
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create a new conversation.",
        variant: "destructive",
      });
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    setCurrentConversationId(conversationId);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation messages.",
        variant: "destructive",
      });
    }
  };

  const handleRenameConversation = async (conversationId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title })
        .eq('id', conversationId);

      if (error) throw error;

      await fetchConversations();
    } catch (error) {
      console.error('Error renaming conversation:', error);
      toast({
        title: "Error",
        description: "Failed to rename the conversation.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      await fetchConversations();
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete the conversation.",
        variant: "destructive",
      });
    }
  };

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', initialData.user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch conversations.",
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
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        llmChoice={llmChoice}
        handleLlmChange={handleLlmChange}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'chat' ? (
        <ChatInterface
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          messages={messages}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isConnected={isConnected}
          isLoading={isLoading}
          samplePrompts={samplePrompts}
          useRAG={useRAG}
          setUseRAG={setUseRAG}
        />
      ) : (
        <MedicalSearchInterface
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
    </div>
  )
}