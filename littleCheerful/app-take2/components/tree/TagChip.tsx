import React from 'react';
import { cn } from '@/lib/utils';

interface TagChipProps {
  tag: string;
  variant: 'intuitive' | 'formal' | 'can-apply';
}

const variantStyles = {
  intuitive: 'bg-crimson-light dark:bg-crimson-dark',
  formal: 'bg-ink-light dark:bg-ink-dark',
  'can-apply': 'bg-gold-light dark:bg-gold-dark',
};

export function TagChip({ tag, variant }: TagChipProps) {
  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center',
        'rounded-full',
        'px-3 py-1',
        'text-xs font-serif',
        'text-parchment-light dark:text-parchment-dark',
        variantStyles[variant]
      )}
    >
      {tag}
    </span>
  );
}
