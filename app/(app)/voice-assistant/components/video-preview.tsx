import { Video } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface VideoPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  wsRef: React.RefObject<WebSocket>;
  isStreaming: boolean;
}

export function VideoPreview({ videoRef, canvasRef, wsRef, isStreaming }: VideoPreviewProps) {
  const frameInterval = useRef<number>();

  useEffect(() => {
    if (isStreaming) {
      // Start screen capture
      navigator.mediaDevices.getDisplayMedia({ 
        video: { 
          frameRate: { ideal: 1 }, // 1 FPS for efficiency
          displaySurface: "monitor"
        } 
      })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Setup frame capture interval
        frameInterval.current = window.setInterval(() => {
          if (!canvasRef.current || !videoRef.current || !wsRef.current) return;

          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Draw current video frame to canvas
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          // Convert canvas to base64 and send to websocket
          const imageData = canvas.toDataURL('image/jpeg', 0.2); // 50% quality for efficiency
          const base64Data = imageData.split(',')[1];

          wsRef.current.send(JSON.stringify({
            type: 'image',
            data: base64Data
          }));
        }, 1000); // Send frame every second
      })
      .catch(err => console.error('Error capturing screen:', err));
    }

    // Cleanup
    return () => {
      if (frameInterval.current) {
        clearInterval(frameInterval.current);
      }
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, [isStreaming]);

  return (
    <div className="bg-card/5 border-border/5 backdrop-blur-sm rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Video className="w-5 h-5 text-primary" />
        <span className="text-primary">Screen Share</span>
      </div>
      
      <div className="relative aspect-video bg-background/40 rounded-lg overflow-hidden backdrop-blur-sm">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width={640}
          height={480}
          className="w-full h-full object-contain"
        />
        <canvas
          ref={canvasRef}
          className="hidden"
          width={640}
          height={480}
        />
      </div>
    </div>
  );
} 