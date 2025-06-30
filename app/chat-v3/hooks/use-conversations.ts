import { useState, useCallback } from 'react';
import {
  createConversationBrowser,
  fetchConversationsBrowser,
  renameConversationBrowser,
  deleteConversationBrowser,
} from '@/lib/supabase/queries/browser/conversations';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { Conversation } from '@/app/chat-v3/types';
import { toast } from 'sonner';

export function useConversations() {
  const supabase = createSupabaseBrowser();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  /* CRUD helpers ---------------------------------------------------------- */
  const fetchConversations = useCallback(async (userId: string) => {
    try {
      setConversations(await fetchConversationsBrowser(userId));
    } catch (e) {
      toast.error('Failed to fetch conversations');
      console.error(e);
    }
  }, []);

  const createConversation = useCallback(
    async (userId: string, title: string) => {
      try {
        const data = await createConversationBrowser(userId, title);
        setConversations(prev => [data, ...prev]);           // optimistic
        return data;
      } catch (e) {
        toast.error('Failed to create conversation');
        console.error(e);
        return null;
      }
    },
    []
  );

  const renameConversation = useCallback(
    async (conversationId: string, title: string) => {
      try {
        await renameConversationBrowser(conversationId, title);
        setConversations(prev =>
          prev.map(c => (c.id === conversationId ? { ...c, title } : c))
        );
      } catch (e) {
        toast.error('Failed to rename conversation');
        console.error(e);
      }
    },
    []
  );

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      try {
        await deleteConversationBrowser(conversationId);
        setConversations(prev => prev.filter(c => c.id !== conversationId));
      } catch (e) {
        toast.error('Failed to delete conversation');
        console.error(e);
      }
    },
    []
  );

  return {
    conversations,
    fetchConversations,
    createConversation,
    renameConversation,
    deleteConversation,
  } as const;
}