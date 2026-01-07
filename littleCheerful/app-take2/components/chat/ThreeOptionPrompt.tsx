import React from 'react';
import { Button } from '@/components/ui/button';

interface ThreeOptionPromptProps {
  onOptionSelect: (option: 'think' | 'hint' | 'explain') => void;
  disabled: boolean;
}

export const ThreeOptionPrompt: React.FC<ThreeOptionPromptProps> = ({
  onOptionSelect,
  disabled,
}) => {
  return (
    <div
      role="group"
      aria-label="Mistake recovery options"
      className="flex flex-row gap-4"
    >
      <Button
        onClick={() => onOptionSelect('think')}
        disabled={disabled}
        variant="outline"
        className="border-crimson-light dark:border-crimson-dark text-crimson-light dark:text-crimson-dark hover:bg-crimson-light/10"
      >
        Think More
      </Button>
      <Button
        onClick={() => onOptionSelect('hint')}
        disabled={disabled}
        variant="outline"
        className="border-crimson-light dark:border-crimson-dark text-crimson-light dark:text-crimson-dark hover:bg-crimson-light/10"
      >
        Give Hint
      </Button>
      <Button
        onClick={() => onOptionSelect('explain')}
        disabled={disabled}
        variant="outline"
        className="border-crimson-light dark:border-crimson-dark text-crimson-light dark:text-crimson-dark hover:bg-crimson-light/10"
      >
        Explain
      </Button>
    </div>
  );
};
