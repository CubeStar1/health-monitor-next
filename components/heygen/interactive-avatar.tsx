import type { StartAvatarResponse } from "@heygen/streaming-avatar";

import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents, TaskMode, TaskType, VoiceEmotion,
} from "@heygen/streaming-avatar";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, usePrevious } from "ahooks";

import InteractiveAvatarTextInput from "./interactive-avatar-text-input";
import { ChatMessageBox } from "./chat-message-box";

import {AVATARS, STT_LANGUAGE_LIST} from "@/lib/constants";
import useUser from '@/hooks/use-user';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Avatar } from "../ui/avatar";

export default function InteractiveAvatar() {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [knowledgeId, setKnowledgeId] = useState<string>("");
  const [avatarId, setAvatarId] = useState<string>("");
  const [language, setLanguage] = useState<string>('en');

  const [data, setData] = useState<StartAvatarResponse>();
  const [text, setText] = useState<string>("");
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const [chatMode, setChatMode] = useState("text_mode");
  const [isUserTalking, setIsUserTalking] = useState(false);

  const [chatHistory, setChatHistory] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>([]);

  const [wsGemini, setWsGemini] = useState<WebSocket | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const clientId = useRef(crypto.randomUUID());

  const [useRag, setUseRag] = useState(false);
  const { data: user } = useUser();

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
    }

    return "";
  }

  async function playAudioFromBase64(base64Audio: string) {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Convert base64 to array buffer
    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create audio buffer and play
    const audioBuffer = await audioContext.current.decodeAudioData(bytes.buffer);
    const source = audioContext.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.current.destination);
    source.start(0);

    // Make the avatar lip sync with the audio duration
    if (avatar.current) {
      await avatar.current.speak({ 
        text: " ", // Empty text as we're just using for lip sync
        taskType: TaskType.REPEAT, 
        taskMode: TaskMode.SYNC,
      });
    }
  }

  async function startSession() {
    setIsLoadingSession(true);
    
    try {
      // Start HeyGen avatar as before
      const newToken = await fetchAccessToken();
      avatar.current = new StreamingAvatar({ token: newToken });
      avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        console.log("Avatar started talking", e);
      });
      avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        console.log("Avatar stopped talking", e);
      });
      avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
        endSession();
      });
      avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
        console.log(">>>>> Stream ready:", event.detail);
        setStream(event.detail);
      });
      avatar.current?.on(StreamingEvents.USER_START, (event) => {
        console.log(">>>>> User started talking:", event);
        setIsUserTalking(true);
      });
      avatar.current?.on(StreamingEvents.USER_STOP, (event) => {
        console.log(">>>>> User stopped talking:", event);
        setIsUserTalking(false);
      });

      // Connect to Gemini WebSocket
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${clientId.current}`);
      
      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'config',
          config: {
            systemPrompt: "You are a helpful AI assistant. Keep responses concise and conversational.",
            voice: "Puck", // Or whichever voice you want to use
            googleSearch: true,
            allowInterruptions: false
          }
        }));
      };

      ws.onmessage = async (event) => {
        const response = JSON.parse(event.data);
        if (response.type === 'audio') {
          await playAudioFromBase64(response.data);
        } else if (response.type === 'text') {
          setChatHistory(prev => [...prev, { 
            role: 'assistant', 
            content: response.text 
          }]);
        }
      };

      setWsGemini(ws);

      try {
        const res = await avatar.current.createStartAvatar({
          quality: AvatarQuality.Low,
          avatarName: avatarId,
          knowledgeId: knowledgeId, // Or use a custom `knowledgeBase`.
          voice: {
            rate: 1.5, // 0.5 ~ 1.5
            emotion: VoiceEmotion.FRIENDLY,
          },
          language: language,
          disableIdleTimeout: true,
        });

        setData(res);
        // default to voice mode
        await avatar.current?.startVoiceChat({
          useSilencePrompt: false
        });
        setChatMode("voice_mode");
      } catch (error) {
        console.error("Error starting avatar session:", error);
      }
    } catch (error) {
      console.error("Error starting session:", error);
    } finally {
      setIsLoadingSession(false);
    }
  }
  async function handleSpeak() {
    setIsLoadingRepeat(true);
    if (!avatar.current) {
      setDebug("Avatar not initialized");
      return;
    }

    try {
      // Add user message to chat history
      setChatHistory(prev => [...prev, { role: 'user', content: text }]);

      let response;
      let aiResponse;

      if (useRag) {
        // Use RAG API
        response = await fetch('/api/rag-query-v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: text,
            match_count: 5,
            llm_choice: "openai",
            user_id: user?.id,
          }),
        });
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        aiResponse = data.response || data.answer;
      } else {
        // Use HeyGen API
        response = await fetch('/api/heygen-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        aiResponse = data.response;
      }

      // Add AI response to chat history
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse 
      }]);

      // Make avatar speak the response
      await avatar.current.speak({ 
        text: aiResponse,
        taskType: TaskType.REPEAT, 
        taskMode: TaskMode.SYNC 
      }).catch((e) => {
        setDebug(e.message);
      });

    } catch (error) {
      console.error('Error:', error);
      setDebug(error instanceof Error ? error.message : 'Failed to get response');
    } finally {
      setIsLoadingRepeat(false);
      setText('');
    }
  }
  async function handleInterrupt() {
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    await avatar.current
      .interrupt()
      .catch((e) => {
        setDebug(e.message);
      });
  }
  async function endSession() {
    if (wsGemini) {
      wsGemini.close();
      setWsGemini(null);
    }
    if (audioContext.current) {
      await audioContext.current.close();
      audioContext.current = null;
    }
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  const handleChangeChatMode = useMemoizedFn(async (v) => {
    if (v === chatMode) {
      return;
    }
    if (v === "text_mode") {
      avatar.current?.closeVoiceChat();
    } else {
      await avatar.current?.startVoiceChat();
    }
    setChatMode(v);
  });

  const previousText = usePrevious(text);
  useEffect(() => {
    if (!previousText && text) {
      avatar.current?.startListening();
    } else if (previousText && !text) {
      avatar?.current?.stopListening();
    }
  }, [text, previousText]);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
      };
    }
  }, [mediaStream, stream]);

  return (
    <div className="w-full flex flex-col gap-4">
      <Card className="max-w-[1600px] w-full mx-auto">
        <CardContent className="p-6">
          {stream ? (
            <div className="flex gap-6 max-h-[calc(100vh-20rem)]">
              <div className="w-2/3 relative rounded-lg overflow-hidden bg-zinc-900">
                <video
                  ref={mediaStream}
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  className="rounded-lg"
                >
                  <track kind="captions" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                <div className="flex flex-col gap-2 absolute bottom-3 right-3 z-10">
                  <Button
                    className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white rounded-lg"
                    variant="default"
                    size="default"
                    onClick={handleInterrupt}
                  >
                    Interrupt task
                  </Button>
                  <Button
                    className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white rounded-lg"
                    variant="default"
                    size="default"
                    onClick={endSession}
                  >
                    End session
                  </Button>
                </div>
              </div>
              <div className="w-1/3 flex flex-col bg-muted/30 rounded-lg p-4">
                <div className="flex flex-col gap-4">
                  <Tabs value={chatMode} onValueChange={handleChangeChatMode} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="text_mode">Text Chat</TabsTrigger>
                      <TabsTrigger value="voice_mode">Voice Chat</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {chatMode === "text_mode" && (
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <Label htmlFor="rag-mode" className="text-sm font-medium">
                        Use Knowledge Base
                      </Label>
                      <Switch
                        id="rag-mode"
                        checked={useRag}
                        onCheckedChange={setUseRag}
                        className="data-[state=checked]:bg-indigo-500"
                      />
                    </div>
                  )}
                </div>

                <ChatMessageBox messages={chatHistory} />

                <div className="mt-4">
                  {chatMode === "text_mode" ? (
                    <InteractiveAvatarTextInput
                      disabled={!stream}
                      input={text}
                      label="Chat"
                      loading={isLoadingRepeat}
                      placeholder="Type something for the avatar to respond"
                      setInput={setText}
                      onSubmit={handleSpeak}
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p>Voice chat coming soon...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : !isLoadingSession ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold tracking-tight">Start a conversation</h2>
                  <p className="mt-2 text-muted-foreground">
                    Choose your preferred avatar and language to begin
                  </p>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {AVATARS.map((avatar) => (
                        <button
                          key={avatar.avatar_id}
                          onClick={() => setAvatarId(avatar.avatar_id)}
                          className={cn(
                            "flex flex-col items-center p-4 rounded-lg border-2 transition-all",
                            avatarId === avatar.avatar_id 
                              ? "border-primary bg-primary/5" 
                              : "border-muted hover:border-primary/50"
                          )}
                        >
                          <div className={cn(
                            "w-20 h-20 rounded-full mb-3",
                            "transition-all",
                            avatar.gradient
                          )}>
                            {/* Avatar preview */}
                          </div>
                          <span className="font-medium">{avatar.name}</span>
                        </button>
                      ))}
                    </div>

                    <Select 
                      onValueChange={(value) => setLanguage(value)} 
                      value={language}
                      defaultValue="en"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {STT_LANGUAGE_LIST.map((lang) => (
                          <SelectItem key={lang.key} value={lang.key}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white"
                    variant="default"
                    size="lg"
                    onClick={startSession}
                    disabled={!avatarId}
                  >
                    Start Conversation
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
