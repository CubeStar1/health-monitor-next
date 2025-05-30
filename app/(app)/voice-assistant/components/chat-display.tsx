import { MessageSquare } from 'lucide-react';

interface ChatDisplayProps {
  text: string;
}

export function ChatDisplay({ text }: ChatDisplayProps) {
  if (!text) return null;

  return (
    <div className="bg-white/[0.02] border-white/[0.05] backdrop-blur-sm rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <span className="text-primary">Live Chat</span>
      </div>
      <div className="space-y-4">
        {text.split('\n').map((msg, index) => (
          <div key={index} className="text-gray-300 text-sm leading-relaxed">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
} 