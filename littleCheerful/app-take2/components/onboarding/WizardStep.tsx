import * as React from 'react';
import { cn } from '@/lib/utils';

export interface WizardStepProps {
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  description: string;
  isActive: boolean;
  children: React.ReactNode;
}

const romanNumerals: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
};

export function WizardStep({
  stepNumber,
  title,
  description,
  isActive,
  children,
}: WizardStepProps) {
  if (!isActive) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      aria-current="step"
      data-animate="fade-in"
      className={cn(
        'animate-in fade-in duration-500',
        'motion-reduce:animate-none motion-reduce:transition-none'
      )}
    >
      {/* Roman numeral indicator */}
      <div className="mb-6 flex items-center gap-4">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            'font-display text-xl font-semibold',
            'bg-crimson-light dark:bg-crimson-dark',
            'text-parchment-light dark:text-parchment-dark'
          )}
        >
          {romanNumerals[stepNumber]}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-ink-light dark:text-ink-dark">
            {title}
          </h3>
          <p className="text-sm text-ink-light/70 dark:text-ink-dark/70">
            {description}
          </p>
        </div>
      </div>

      {/* Step content */}
      <div>{children}</div>
    </div>
  );
}
