import * as React from 'react';
import { OrnateHeading } from '@/components/roman/OrnateHeading';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EasterEggProps {
  show: boolean;
  onContinue: () => void;
}

export function EasterEgg({ show, onContinue }: EasterEggProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Focus the continue button when shown for keyboard accessibility
  React.useEffect(() => {
    if (show && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [show]);

  // Handle Enter key to trigger continue
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onContinue();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      data-testid="easter-egg-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="easter-egg-title"
      data-reduce-motion="true"
      className={cn(
        // Full-screen overlay
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'bg-black/80',
        // Fade-in animation
        'animate-in fade-in duration-700',
        'motion-reduce:animate-none motion-reduce:transition-none'
      )}
    >
      <div
        data-animate="scale-up"
        className={cn(
          'text-center',
          'animate-in zoom-in duration-1000',
          'motion-reduce:animate-none'
        )}
      >
        {/* Dramatic heading */}
        <div id="easter-egg-title">
          <OrnateHeading
            level={1}
            className="mb-8 text-6xl text-gold-light dark:text-gold-dark"
          >
            SURPRISE KEENAN!
          </OrnateHeading>
        </div>

        {/* Continue button */}
        <Button
          ref={buttonRef}
          onClick={onContinue}
          onKeyDown={handleKeyDown}
          size="lg"
          className="bg-crimson-light hover:bg-crimson-dark dark:bg-crimson-dark dark:hover:bg-crimson-light text-parchment-light dark:text-parchment-dark"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
