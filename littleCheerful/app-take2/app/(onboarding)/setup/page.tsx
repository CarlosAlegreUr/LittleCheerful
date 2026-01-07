'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardContainer } from '@/components/onboarding/WizardContainer';
import { PreferenceSelector, type Preferences } from '@/components/onboarding/PreferenceSelector';
import { QuillLoader } from '@/components/roman/QuillLoader';
import type { LearningProfile } from '@/lib/types';

// Map PreferenceSelector's interface to LearningProfile
function preferencesToProfile(prefs: Preferences): Partial<LearningProfile> {
  return {
    teaching_tone: prefs.tone === 'socratic' ? 'balanced' : prefs.tone === 'encouraging' ? 'nice' : 'direct',
    motivation_style: prefs.motivation === 'mastery' ? 'positive-reinforcement' : prefs.motivation === 'curiosity' ? 'balanced' : 'tough-love',
    default_source_depth: prefs.depth === 'surface' ? 1 : prefs.depth === 'balanced' ? 2 : 3,
    terminology_level: prefs.pace === 'slow' ? 'casual' : prefs.pace === 'adaptive' ? 'adaptive' : 'academic',
    example_preferences: prefs.format === 'conversational' ? 'analogies' : 'both',
    preferred_language: 'en',
  };
}

export default function SetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({
    tone: 'socratic',
    motivation: 'curiosity',
    depth: 'balanced',
    pace: 'adaptive',
    format: 'conversational',
    breaks: 'moderate',
  });

  const handleStepChange = (step: number) => {
    setCurrentStep(step as 1 | 2 | 3 | 4 | 5 | 6);
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const profile: LearningProfile = {
        ...preferencesToProfile(preferences),
        created: new Date().toISOString(),
      } as LearningProfile;

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error(`Failed to save profile: ${response.statusText}`);
      }

      // Redirect to /learn after successful save
      router.push('/learn');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <WizardContainer
        currentStep={currentStep}
        onStepChange={handleStepChange}
        onComplete={handleComplete}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <QuillLoader />
            <p className="mt-4 text-center" style={{ color: 'var(--color-ink)' }}>
              Saving your profile...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-crimson-light dark:text-crimson-dark">
              Error: {error}
            </p>
          </div>
        ) : (
          <PreferenceSelector
            preferences={preferences}
            onChange={setPreferences}
          />
        )}
      </WizardContainer>
    </main>
  );
}
