"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useConversations } from "./use-conversations";

interface ConversationsContextValue extends ReturnType<typeof useConversations> {}

const ConversationsContext = createContext<ConversationsContextValue | null>(null);

export function ConversationsProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const conv = useConversations();
  const { fetchConversations } = conv;

  // bootstrap on mount
  useEffect(() => {
    if (!userId) return;
    fetchConversations(userId);
  }, [userId, fetchConversations]);

  return (
    <ConversationsContext.Provider value={conv}>{children}</ConversationsContext.Provider>
  );
}

export function useConversationsContext() {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error("useConversationsContext must be used within ConversationsProvider");
  return ctx;
}
