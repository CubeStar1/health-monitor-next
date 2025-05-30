import { useRef, useEffect } from 'react'
import { Message } from '../types';
import { MessageItem } from './message-item';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-grow overflow-y-auto scrollbar-hide">
      {messages.map((m, index) => (
        <MessageItem key={index} message={m} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}