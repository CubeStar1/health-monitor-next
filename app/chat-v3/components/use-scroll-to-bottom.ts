import { useEffect, useRef, type RefObject } from 'react';
import { type Message } from 'ai';

export function useScrollToBottom<T extends HTMLElement>(messages: Message[]): [
  RefObject<T>,
  RefObject<T>,
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    const end = endRef.current;
    if (end) {
      end.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages.length]);

  return [containerRef, endRef] as [RefObject<T>, RefObject<T>];
}
