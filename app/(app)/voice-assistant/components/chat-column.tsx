import { VideoPreview } from './video-preview';
import { AudioMonitor } from './audio-monitor';
import { ChatDisplay } from './chat-display';

interface ChatColumnProps {
  chatMode: 'audio' | 'video' | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  wsRef: React.RefObject<WebSocket>;
  isStreaming: boolean;
  text: string;
}

export function ChatColumn({ chatMode, videoRef, canvasRef, wsRef, isStreaming, text }: ChatColumnProps) {
  return (
    <div className="space-y-6">
      {chatMode === 'video' && (
        <VideoPreview 
          videoRef={videoRef} 
          canvasRef={canvasRef}
          wsRef={wsRef}
          isStreaming={isStreaming}
        />
      )}
      
      {isStreaming && (
        <AudioMonitor isStreaming={isStreaming} />
      )}

      <ChatDisplay text={text} />
    </div>
  );
} 