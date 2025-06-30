import { createSupabaseServer } from "../../server";
import { Conversation } from "@/app/chat-v3/types";

export async function fetchConversationsServer(userId: string): Promise<Conversation[]> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Conversation[];
}

export async function createConversationServer(userId: string, title = "New Chat"): Promise<Conversation> {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("conversations")
    .insert({ title, user_id: userId })
    .select()
    .single();

  if (error || !data) throw error ?? new Error("Failed to create conversation");
  return data as Conversation;
}

export async function renameConversationServer(conversationId: string, title: string): Promise<void> {
  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("conversations")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", conversationId);
  if (error) throw error;
}

export async function deleteConversationServer(conversationId: string): Promise<void> {
  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);
  if (error) throw error;
}
