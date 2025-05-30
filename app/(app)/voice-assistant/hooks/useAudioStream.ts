import { useState, useRef } from 'react';
import { float32ToPcm16 } from '../utils';

interface AudioInput {
  source: MediaStreamAudioSourceNode;
  processor: ScriptProcessorNode;
  stream: MediaStream;
}

export function useAudioStream() {
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioInputRef = useRef<AudioInput | null>(null);

  const startAudioStream = async (wsRef: React.MutableRefObject<WebSocket | null>) => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000
      });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(512, 1, 1);
      
      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmData = float32ToPcm16(inputData);
          const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
          wsRef.current.send(JSON.stringify({
            type: 'audio',
            data: base64Data
          }));
        }
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      
      audioInputRef.current = { source, processor, stream };
    } catch (err) {
      setError('Failed to access microphone: ' + (err as Error).message);
    }
  };

  const stopAudioStream = () => {
    if (audioInputRef.current) {
      const { source, processor, stream } = audioInputRef.current;
      source.disconnect();
      processor.disconnect();
      stream.getTracks().forEach(track => track.stop());
      audioInputRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  return {
    error,
    startAudioStream,
    stopAudioStream
  };
} 