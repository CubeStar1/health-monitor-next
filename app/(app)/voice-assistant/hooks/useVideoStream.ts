import { useRef, useEffect } from 'react';

export function useVideoStream() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startVideoStream = async (wsRef: React.MutableRefObject<WebSocket | null>) => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      videoRef.current.srcObject = stream;
      videoStreamRef.current = stream;
      
      videoIntervalRef.current = setInterval(() => {
        captureAndSendFrame(wsRef);
      }, 1000);

    } catch (err) {
      console.error('Video initialization error:', err);
      throw new Error('Failed to access camera: ' + (err as Error).message);
    }
  };

  const captureAndSendFrame = (wsRef: React.MutableRefObject<WebSocket | null>) => {
    if (!canvasRef.current || !videoRef.current || !wsRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0);
    const base64Image = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    
    wsRef.current.send(JSON.stringify({
      type: 'image',
      data: base64Image
    }));
  };

  const stopVideoStream = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    if (videoIntervalRef.current) {
      clearInterval(videoIntervalRef.current);
      videoIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopVideoStream();
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    startVideoStream,
    stopVideoStream
  };
} 