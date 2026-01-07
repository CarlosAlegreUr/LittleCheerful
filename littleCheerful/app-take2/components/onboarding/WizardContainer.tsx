import * as React from 'react';
import { cn } from '@/lib/utils';
import { ParchmentCard } from '@/components/roman/ParchmentCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface WizardContainerProps {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  onStepChange: (step: number) => void;
  onComplete: () => void;
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

const totalSteps = 6;

export function WizardContainer({
  currentStep,
  onStepChange,
  onComplete,
  children,
}: WizardContainerProps) {
  const handlePrevious = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      {/* Progress Indicator */}
      <nav aria-label="Wizard navigation" className="mb-8">
        <ol className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
            const isComplete = step < currentStep;
            const isActive = step === currentStep;

            return (
              <li key={step}>
                <div className="flex items-center">
                  {/* Step indicator circle */}
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full',
                      'font-display text-lg font-semibold',
                      'border-2 transition-colors',
                      isComplete && 'bg-gold-light dark:bg-gold-dark border-gold-light dark:border-gold-dark text-ink-light dark:text-ink-dark',
                      isActive && 'bg-crimson-light dark:bg-crimson-dark border-crimson-light dark:border-crimson-dark text-parchment-light dark:text-parchment-dark',
                      !isComplete && !isActive && 'bg-parchment-light dark:bg-parchment-dark border-border-medium text-disabled-light dark:text-disabled-dark'
                    )}
                  >
                    {romanNumerals[step]}
                  </div>

                  {/* Connector line */}
                  {step < totalSteps && (
                    <div
                      className={cn(
                        'h-0.5 w-8',
                        isComplete
                          ? 'bg-gold-light dark:bg-gold-dark'
                          : 'border-t-2 border-dotted border-border-medium'
                      )}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Content Area */}
      <ParchmentCard className="mb-6 p-6">{children}</ParchmentCard>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
        </div>

        <div>
          {currentStep < totalSteps ? (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              className="bg-gold-light hover:bg-gold-dark dark:bg-gold-dark dark:hover:bg-gold-light"
            >
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
