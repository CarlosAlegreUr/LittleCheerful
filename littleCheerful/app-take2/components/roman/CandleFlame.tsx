'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

export interface CandleFlameProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * CandleFlame - Animated flame icon with candle flicker effect
 * Respects prefers-reduced-motion for accessibility
 * Used for "live" indicators and ambient decorative elements
 */
export function CandleFlame({ size = 'md', className }: CandleFlameProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={cn(
        sizeClasses[size],
        'text-gold-light dark:text-gold-dark',
        'inline-flex items-center justify-center',
        'animate-candle-flicker', // CSS animation from globals.css
        className
      )}
    >
      <Flame className={sizeClasses[size]} />
    </div>
  );
}
