import React from 'react';
import { cn } from '@/lib/utils';
import { ConceptStatus } from '@/lib/types';

interface ProgressBadgeProps {
  status: ConceptStatus;
  percentage: number;
}

const statusStyles = {
  NOT_STARTED: 'bg-disabled text-parchment-light dark:text-parchment-dark',
  IN_PROGRESS: 'bg-info-light dark:bg-info-dark text-parchment-light dark:text-parchment-dark',
  STUDIED: 'bg-gold-light dark:bg-gold-dark text-ink-light dark:text-ink-dark',
};

export function ProgressBadge({ status, percentage }: ProgressBadgeProps) {
  const [prevPercentage, setPrevPercentage] = React.useState(percentage);
  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  // Trigger scale pulse animation when percentage changes
  React.useEffect(() => {
    if (percentage !== prevPercentage) {
      setShouldAnimate(true);
      setPrevPercentage(percentage);

      // Reset animation flag after animation completes
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [percentage, prevPercentage]);

  return (
    <div
      role="img"
      aria-label={`Progress: ${percentage}%`}
      className={cn(
        'flex items-center justify-center',
        'w-12 h-12',
        'rounded-full',
        'text-sm font-semibold',
        statusStyles[status],
        shouldAnimate && 'animate-scale-pulse'
      )}
    >
      {percentage}%
    </div>
  );
}
