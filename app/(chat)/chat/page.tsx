import { Suspense } from 'react'
import { createSupabaseServer } from '@/lib/supabase/server'
import ChatPageClient from './chat-client'
import { ChatSkeleton } from './components/chat-skeleton'

export const revalidate = 0

async function getInitialData() {
  const supabase = createSupabaseServer()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { user: null, conversations: [], messages: [] }
  }

  const { data: conversations, error: conversationsError } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (conversationsError) {
    console.error('Error fetching conversations:', conversationsError)
    return { user, conversations: [], messages: [] }
  }

  let messages = []
  if (conversations.length > 0) {
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversations[0].id)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
    } else {
      messages = messagesData
    }
  }

  return { user, conversations, messages }
}

export default async function ChatPage() {
  return (
    <Suspense fallback={<ChatLoadingState />}>
      <ChatContent />
    </Suspense>
  )
}

async function ChatContent() {
  const initialData = await getInitialData()
  return <ChatPageClient initialData={initialData} />
}

function ChatLoadingState() {
  return (
    <div className="flex h-screen">
      <ChatSkeleton />
    </div>
  )
}