import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ParchmentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
}

export function ParchmentCard({
  children,
  className,
  variant = 'default',
  ...props
}: ParchmentCardProps) {
  return (
    <Card
      className={cn(
        // Base parchment styling from ux-design.md
        'bg-parchment-light dark:bg-parchment-dark',
        'border border-border-medium',
        'rounded-xl', // 12px border radius for organic feel
        'texture-parchment', // Paper grain texture overlay

        // Variant-specific shadow
        variant === 'default' && 'shadow-md',
        variant === 'elevated' && 'shadow-lg',

        // Custom className
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
