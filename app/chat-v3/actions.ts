'use server'

import { createSupabaseServer } from '@/lib/supabase/server'
import { type Message } from 'ai'

export async function saveMessages(messages: Message[], conversationId: string) {
  const supabase = await createSupabaseServer()

  const messagesToInsert = messages.map((message) => ({
    conversation_id: conversationId,
    content: message.content,
    role: message.role,
    tool_invocations: message.toolInvocations,
  }))

  const { error } = await supabase.from('messages').insert(messagesToInsert)

  if (error) {
    console.error('Error saving messages:', error)
    throw new Error('Could not save messages')
  }
}
