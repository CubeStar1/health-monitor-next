import { useRef } from 'react';
import { base64ToFloat32Array } from '../utils';

export function useAudioPlayback() {
  const audioBuffer = useRef<Float32Array[]>([]);
  const isPlaying = useRef(false);

  const playAudioData = async (audioData: Float32Array) => {
    audioBuffer.current.push(audioData);
    if (!isPlaying.current) {
      await playNextInQueue();
    }
  };

  const playNextInQueue = async () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (audioBuffer.current.length === 0) {
      isPlaying.current = false;
      return;
    }

    isPlaying.current = true;
    const audioData = audioBuffer.current.shift();
    if (!audioData) return;

    const buffer = audioContext.createBuffer(1, audioData.length, 24000);
    buffer.copyToChannel(audioData, 0);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.onended = () => {
      playNextInQueue();
    };
    source.start();
  };

  const handleAudioMessage = async (data: string) => {
    const audioData = base64ToFloat32Array(data);
    await playAudioData(audioData);
  };

  return {
    handleAudioMessage
  };
} 