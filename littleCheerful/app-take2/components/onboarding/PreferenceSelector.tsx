import * as React from 'react';
import { ParchmentCard } from '@/components/roman/ParchmentCard';
import { cn } from '@/lib/utils';

export interface Preferences {
  tone: 'socratic' | 'encouraging' | 'direct';
  motivation: 'mastery' | 'curiosity' | 'productivity';
  depth: 'surface' | 'balanced' | 'deep';
  pace: 'slow' | 'adaptive' | 'fast';
  format: 'conversational' | 'structured';
  breaks: 'frequent' | 'moderate' | 'minimal';
}

export interface PreferenceSelectorProps {
  preferences: Preferences;
  onChange: (preferences: Preferences) => void;
}

interface PreferenceOption {
  value: string;
  label: string;
  description: string;
}

const preferenceCategories: Record<
  keyof Preferences,
  {
    title: string;
    description: string;
    options: PreferenceOption[];
  }
> = {
  tone: {
    title: 'Tone',
    description: 'How should I communicate with you?',
    options: [
      {
        value: 'socratic',
        label: 'Socratic',
        description: 'Question-based, guided discovery',
      },
      {
        value: 'encouraging',
        label: 'Encouraging',
        description: 'Supportive and motivational',
      },
      {
        value: 'direct',
        label: 'Direct',
        description: 'Straightforward explanations',
      },
    ],
  },
  motivation: {
    title: 'Motivation',
    description: 'What drives your learning?',
    options: [
      {
        value: 'mastery',
        label: 'Mastery',
        description: 'Deep understanding and expertise',
      },
      {
        value: 'curiosity',
        label: 'Curiosity',
        description: 'Exploration and discovery',
      },
      {
        value: 'productivity',
        label: 'Productivity',
        description: 'Practical skills and efficiency',
      },
    ],
  },
  depth: {
    title: 'Depth',
    description: 'How deep should we go?',
    options: [
      {
        value: 'surface',
        label: 'Surface',
        description: 'High-level overview',
      },
      {
        value: 'balanced',
        label: 'Balanced',
        description: 'Mix of concepts and details',
      },
      {
        value: 'deep',
        label: 'Deep',
        description: 'Thorough exploration',
      },
    ],
  },
  pace: {
    title: 'Pace',
    description: 'How fast should we move?',
    options: [
      {
        value: 'slow',
        label: 'Slow',
        description: 'Take your time, no rush',
      },
      {
        value: 'adaptive',
        label: 'Adaptive',
        description: 'Adjust based on understanding',
      },
      {
        value: 'fast',
        label: 'Fast',
        description: 'Quick progression',
      },
    ],
  },
  format: {
    title: 'Format',
    description: 'How should lessons be structured?',
    options: [
      {
        value: 'conversational',
        label: 'Conversational',
        description: 'Natural dialogue flow',
      },
      {
        value: 'structured',
        label: 'Structured',
        description: 'Clear steps and sections',
      },
    ],
  },
  breaks: {
    title: 'Breaks',
    description: 'How often should we pause?',
    options: [
      {
        value: 'frequent',
        label: 'Frequent',
        description: 'Regular check-ins',
      },
      {
        value: 'moderate',
        label: 'Moderate',
        description: 'Occasional pauses',
      },
      {
        value: 'minimal',
        label: 'Minimal',
        description: 'Continuous learning',
      },
    ],
  },
};

export function PreferenceSelector({
  preferences,
  onChange,
}: PreferenceSelectorProps) {
  const handleChange = (category: keyof Preferences, value: string) => {
    onChange({
      ...preferences,
      [category]: value,
    });
  };

  return (
    <div className="space-y-6">
      {(Object.keys(preferenceCategories) as Array<keyof Preferences>).map(
        (category) => {
          const categoryData = preferenceCategories[category];
          const currentValue = preferences[category];

          return (
            <ParchmentCard key={category} className="p-4">
              <fieldset role="group">
                <legend className="mb-3 text-lg font-semibold text-ink-light dark:text-ink-dark">
                  {categoryData.title}
                </legend>
                <p className="mb-4 text-sm text-ink-light/70 dark:text-ink-dark/70">
                  {categoryData.description}
                </p>

                <div className="space-y-2">
                  {categoryData.options.map((option) => {
                    const id = `${category}-${option.value}`;
                    const isChecked = currentValue === option.value;

                    return (
                      <label
                        key={option.value}
                        htmlFor={id}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-colors',
                          isChecked
                            ? 'border-gold-light dark:border-gold-dark bg-gold-light/10 dark:bg-gold-dark/10'
                            : 'border-border-light hover:border-border-medium'
                        )}
                      >
                        <input
                          type="radio"
                          id={id}
                          name={category}
                          value={option.value}
                          checked={isChecked}
                          onChange={() => handleChange(category, option.value)}
                          aria-label={option.label}
                          className="mt-1 h-4 w-4 text-gold-light focus:ring-gold-light dark:text-gold-dark dark:focus:ring-gold-dark"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-ink-light dark:text-ink-dark">
                            {option.label}
                          </div>
                          <div className="text-sm text-ink-light/60 dark:text-ink-dark/60">
                            {option.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </ParchmentCard>
          );
        }
      )}
    </div>
  );
}
