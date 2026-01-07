'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface QuillLoaderProps {
  text?: string;
  className?: string;
}

export function QuillLoader({ text, className }: QuillLoaderProps) {
  return (
    <div
      data-testid="quill-loader"
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-2', className)}
    >
      <svg
        className={cn(
          'stroke-ink-light dark:stroke-ink-dark',
          'animate-pulse'
        )}
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Quill feather */}
        <path
          d="M8 40 L24 24 L32 8 M24 24 L40 16"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-[draw_1.2s_ease-in_infinite]"
        />
        {/* Quill tip */}
        <path
          d="M8 40 L4 44"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {text && (
        <span className="text-sm text-ink-light dark:text-ink-dark opacity-70">
          {text}
        </span>
      )}
    </div>
  );
}
