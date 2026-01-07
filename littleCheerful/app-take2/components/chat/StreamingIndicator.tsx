import React from 'react';

interface StreamingIndicatorProps {
  visible: boolean;
}

export const StreamingIndicator: React.FC<StreamingIndicatorProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="flex items-center gap-2" role="status" aria-live="polite" aria-busy="true">
      <div data-testid="quill-loader">
        <svg
          className="stroke-ink-light dark:stroke-ink-dark animate-pulse"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 40 L24 24 L32 8 M24 24 L40 16"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-[draw_1.2s_ease-in_infinite]"
          />
          <path
            d="M8 40 L4 44"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-ink-light dark:text-ink-dark text-sm">
        Claude is writing...
      </span>
    </div>
  );
};
