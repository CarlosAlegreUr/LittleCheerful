import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="font-crimson text-ink-light dark:text-ink-dark space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-garamond text-3xl font-semibold mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-garamond text-2xl font-semibold mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-garamond text-xl font-semibold mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="leading-relaxed mb-4">
              {children}
            </p>
          ),
          code: ({ inline, children, ...props }: any) => (
            inline ? (
              <code className="bg-marble-light dark:bg-marble-dark px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className="block bg-marble-light dark:bg-marble-dark p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props}>
                {children}
              </code>
            )
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-crimson-light dark:text-crimson-dark underline hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-4">
              {children}
            </ol>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
