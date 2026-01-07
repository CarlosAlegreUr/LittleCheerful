'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GoldenFlourishProps {
  className?: string;
  animate?: boolean;
}

/**
 * GoldenFlourish - Decorative SVG ornament with stroke animation
 * Inspired by illuminated manuscript decorations
 * Used for success states, section dividers, and celebratory overlays
 */
export function GoldenFlourish({ className, animate = true }: GoldenFlourishProps) {
  // Calculate approximate path length for stroke-dasharray
  const flourishLength = 250;

  return (
    <svg
      className={cn('stroke-gold-light dark:stroke-gold-dark', className)}
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={
        animate
          ? {
              '--flourish-length': `${flourishLength}`,
            } as React.CSSProperties
          : undefined
      }
    >
      {/* Left flourish */}
      <path
        d="M10 20 Q20 10, 35 20 T55 20"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className={animate ? 'animate-flourish' : ''}
      />

      {/* Center ornament */}
      <circle
        cx="60"
        cy="20"
        r="4"
        strokeWidth="2"
        fill="none"
        className={animate ? 'animate-flourish' : ''}
        style={
          animate
            ? {
                animationDelay: '400ms',
              }
            : undefined
        }
      />

      {/* Right flourish */}
      <path
        d="M65 20 Q75 10, 85 20 T110 20"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className={animate ? 'animate-flourish' : ''}
        style={
          animate
            ? {
                animationDelay: '200ms',
              }
            : undefined
        }
      />

      {/* Decorative dots */}
      <circle
        cx="30"
        cy="20"
        r="1.5"
        fill="currentColor"
        className="text-gold-light dark:text-gold-dark"
        style={
          animate
            ? {
                opacity: 0,
                animation: 'flourishDraw 400ms ease-out 600ms forwards',
              }
            : undefined
        }
      />
      <circle
        cx="90"
        cy="20"
        r="1.5"
        fill="currentColor"
        className="text-gold-light dark:text-gold-dark"
        style={
          animate
            ? {
                opacity: 0,
                animation: 'flourishDraw 400ms ease-out 600ms forwards',
              }
            : undefined
        }
      />
    </svg>
  );
}
