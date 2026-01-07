import React from 'react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <article
      className={cn(
        'max-w-[70%] rounded-2xl border px-6 py-4 shadow-sm',
        'texture-parchment', // Paper grain texture
        'animate-message-fade-in', // Fade-in animation from globals.css
        'relative', // For scroll curl positioning
        isUser
          ? 'ml-auto bg-marble-light dark:bg-marble-dark border-border-medium scroll-curl-right'
          : 'mr-auto bg-parchment-light dark:bg-parchment-dark border-border-light scroll-curl-left'
      )}
      aria-label={`Message from ${role}, sent at ${formatTime(timestamp)}`}
    >
      <div className="space-y-2">
        <p className="text-ink-light dark:text-ink-dark text-base leading-relaxed">
          {content}
        </p>
        <time
          className="block text-xs text-ink-light/60 dark:text-ink-dark/60"
          dateTime={timestamp.toISOString()}
        >
          {formatTime(timestamp)}
        </time>
      </div>
    </article>
  );
};
