import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Video } from 'lucide-react';

interface ControlDockProps {
  isStreaming: boolean;
  onStartAudio: () => void;
  onStartVideo: () => void;
  onStop: () => void;
}

export function ControlDock({ isStreaming, onStartAudio, onStartVideo, onStop }: ControlDockProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 bg-background/80 backdrop-blur-lg border-t">
      <div className="w-full px-4 py-4">
        <div className="flex justify-center items-center gap-4 lg:max-w-[calc(100%-240px)] lg:ml-auto">
          {!isStreaming ? (
            <>
              <Button
                size="lg"
                onClick={onStartAudio}
                className="rounded-full px-8"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Audio Chat
              </Button>
              <Button
                size="lg"
                onClick={onStartVideo}
                className="rounded-full px-8"
              >
                <Video className="h-5 w-5 mr-2" />
                Start Video Chat
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              variant="destructive"
              onClick={onStop}
              className="rounded-full px-8"
            >
              <StopCircle className="h-5 w-5 mr-2" />
              Stop Chat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 