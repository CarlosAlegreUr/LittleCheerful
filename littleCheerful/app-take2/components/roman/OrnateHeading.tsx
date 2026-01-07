import * as React from 'react';
import { cn } from '@/lib/utils';

export interface OrnateHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export function OrnateHeading({
  level,
  children,
  className,
}: OrnateHeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  const sizeClasses = {
    1: 'text-4xl', // 2rem = 32px (H1 from ux-design.md)
    2: 'text-3xl', // 1.5rem = 24px (H2 from ux-design.md)
    3: 'text-2xl', // 1.25rem = 20px (H3 from ux-design.md)
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base',
  };

  return (
    <Tag
      className={cn(
        // EB Garamond font for display text
        'font-display',
        'font-semibold',

        // Gold underline decoration
        'border-b',
        'border-gold-light dark:border-gold-dark',
        'pb-2',

        // Size based on level
        sizeClasses[level],

        // Ink color for text
        'text-ink-light dark:text-ink-dark',

        // Custom className
        className
      )}
    >
      {children}
    </Tag>
  );
}
