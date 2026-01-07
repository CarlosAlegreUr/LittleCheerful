'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

export interface CandleFlameProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CandleFlame({ size = 'md', className }: CandleFlameProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      className={cn(
        sizeClasses[size],
        'text-gold-light dark:text-gold-dark',
        'inline-flex items-center justify-center',
        className
      )}
      animate={{
        opacity: [1, 0.85, 1, 0.9, 1],
      }}
      transition={{
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
    >
      <Flame className={cn(sizeClasses[size], 'animate-pulse')} />
    </motion.div>
  );
}
