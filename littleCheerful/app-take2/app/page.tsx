'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EasterEgg } from '@/components/onboarding/EasterEgg';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function HomePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await fetch('/api/profile/exists', {
          method: 'HEAD',
        });

        if (response.ok) {
          // Profile exists, redirect to /learn
          router.push('/learn');
        } else {
          // No profile, show easter egg
          setShowEasterEgg(true);
        }
      } catch (error) {
        console.error('Failed to check profile:', error);
        setShowEasterEgg(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [router]);

  const handleEasterEggContinue = () => {
    setShowEasterEgg(false);
    router.push('/setup');
  };

  if (isChecking) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <EasterEgg show={showEasterEgg} onContinue={handleEasterEggContinue} />

      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-6xl font-display font-semibold mb-6" style={{ color: 'var(--color-crimson)' }}>
            Little Cheerful
          </h1>
          <p className="text-xl mb-8" style={{ color: 'var(--color-ink)' }}>
            Your personal Socratic learning companion
          </p>

          {/* Theme Toggle */}
          <div className="fixed top-4 right-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
