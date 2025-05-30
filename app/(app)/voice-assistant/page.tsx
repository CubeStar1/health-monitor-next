'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAudioStream } from './hooks/useAudioStream';
import { useVideoStream } from './hooks/useVideoStream';
import { useAudioPlayback } from './hooks/useAudioPlayback';
import InteractiveAvatar from '@/components/heygen/interactive-avatar';
import type { Config } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMedicalSummary } from '@/hooks/use-medical-summary';
import { VoiceSettings } from './components/voice-settings';
import { RagPipeline } from './components/rag-pipeline';
import { ChatColumn } from './components/chat-column';
import { ControlDock } from './components/control-dock';

const WS_URL = process.env.NEXT_PUBLIC_API_URL;
const WS_URL_SPLIT = WS_URL?.split("://")[1];
const WS_PORT = WS_URL_SPLIT?.split(":")[1];

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const voices = ["Puck", "Charon", "Kore", "Fenrir", "Aoede"];

export default function GeminiVoiceChat() {
  const { data: medicalSummary } = useMedicalSummary();
  const [isStreaming, setIsStreaming] = useState(false);
  const [text, setText] = useState('');
  const [config, setConfig] = useState<Config>({
    systemPrompt: "You are a friendly Gemini 2.0 model. Respond verbally in a casual, helpful tone.",
    voice: "Puck",
    googleSearch: true,
    allowInterruptions: false
  });
  const [isConnected, setIsConnected] = useState(false);
  const [chatMode, setChatMode] = useState<'audio' | 'video' | null>(null);
  const [activeTab, setActiveTab] = useState<'gemini' | 'heygen'>('gemini');
  
  const wsRef = useRef<WebSocket | null>(null);
  const clientId = useRef(crypto.randomUUID());
  
  const { error, startAudioStream, stopAudioStream } = useAudioStream();
  const { videoRef, canvasRef, startVideoStream, stopVideoStream } = useVideoStream();
  const { handleAudioMessage } = useAudioPlayback();

  useEffect(() => {
    if (medicalSummary) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        systemPrompt: `You are a helpful AI medical assistant. Always greet the user with an intro about how you are an AI health assistant. Here's a summary of the patient's medical history:

${medicalSummary}

Please use this context to provide personalized and relevant medical advice. Keep responses concise, clear, and always refer to the patient's specific medical context when appropriate. If asked about medications or treatments not in their history, remind them to consult their healthcare provider.`,
      }));
    }
  }, [medicalSummary]);

  const startStream = async (mode: 'audio' | 'video') => {
    setChatMode(mode);
    wsRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/${clientId.current}`);
    
    wsRef.current.onopen = async () => {
      if (!wsRef.current) return;
      
      wsRef.current.send(JSON.stringify({
        type: 'config',
        config: config
      }));
      
      await startAudioStream(wsRef);
      if (mode === 'video') {
        await startVideoStream(wsRef);
      }
      setIsStreaming(true);
      setIsConnected(true);
    };

    wsRef.current.onmessage = async (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      if (response.type === 'audio') {
        await handleAudioMessage(response.data);
      } else if (response.type === 'text') {
        setText(prev => prev + response.text + '\n');
      }
    };

    wsRef.current.onerror = (error: Event) => {
      const err = error as ErrorEvent;
      console.error('WebSocket error:', err.message || 'Unknown error');
      setIsStreaming(false);
    };

    wsRef.current.onclose = () => {
      setIsStreaming(false);
      setIsConnected(false);
    };
  };

  const stopStream = () => {
    stopAudioStream();
    if (chatMode === 'video') {
      stopVideoStream();
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsStreaming(false);
    setIsConnected(false);
    setChatMode(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">AI Assistant</Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-2">AI Voice Assistant</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose between Gemini and HeyGen for voice and video interactions.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'gemini' | 'heygen')} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mx-auto">
            <TabsTrigger value="gemini">Gemini Assistant</TabsTrigger>
            <TabsTrigger value="heygen">HeyGen Avatar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gemini" className="mt-6">
            {error && (
              <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-24 max-w-6xl mx-auto">
              <div className="space-y-6">
                <VoiceSettings
                  config={config}
                  setConfig={setConfig}
                  isConnected={isConnected}
                  voices={voices}
                />
                <RagPipeline />
              </div>

              <ChatColumn
                chatMode={chatMode}
                videoRef={videoRef}
                canvasRef={canvasRef}
                wsRef={wsRef}
                isStreaming={isStreaming}
                text={text}
              />
            </div>

            <ControlDock
              isStreaming={isStreaming}
              onStartAudio={() => startStream('audio')}
              onStartVideo={() => startStream('video')}
              onStop={stopStream}
            />
          </TabsContent>

          <TabsContent value="heygen" className="mt-6">
            <InteractiveAvatar />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}