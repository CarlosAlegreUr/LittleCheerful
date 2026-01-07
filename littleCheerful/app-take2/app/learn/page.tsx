'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ParchmentCard } from '@/components/roman/ParchmentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuillLoader } from '@/components/roman/QuillLoader';
import { Plus } from 'lucide-react';

interface Goal {
  name: string;
  progress: number;
}

export default function LearnPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/learning/goals');

        if (!response.ok && response.status !== 404) {
          throw new Error(`Failed to fetch goals: ${response.statusText}`);
        }

        if (response.ok) {
          const data = await response.json();
          setGoals(data.goals || []);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleCreateGoal = async () => {
    if (!newGoalInput.trim()) return;

    try {
      setIsCreating(true);
      setError(null);

      const response = await fetch('/api/learning/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal: newGoalInput }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create goal: ${response.statusText}`);
      }

      const data = await response.json();

      // Navigate to the new goal page
      router.push(`/learn/${data.goalName}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-semibold" style={{ color: 'var(--color-crimson)' }}>
            Your Learning Goals
          </h1>
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <QuillLoader />
          </div>
        ) : error ? (
          <ParchmentCard className="p-8">
            <p className="text-center text-crimson-light dark:text-crimson-dark">
              Error: {error}
            </p>
          </ParchmentCard>
        ) : goals.length === 0 ? (
          <ParchmentCard className="p-8">
            <p className="text-center text-ink-light dark:text-ink-dark">
              No goals yet. Click &quot;New Goal&quot; to get started!
            </p>
          </ParchmentCard>
        ) : (
          <div className="grid gap-4">
            {goals.map((goal) => (
              <ParchmentCard
                key={goal.name}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/learn/${encodeURIComponent(goal.name)}`)}
              >
                <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>
                  {goal.name}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-border-light dark:bg-border-dark rounded-full h-2">
                    <div
                      className="bg-gold-light dark:bg-gold-dark h-2 rounded-full transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--color-ink)' }}>
                    {goal.progress}%
                  </span>
                </div>
              </ParchmentCard>
            ))}
          </div>
        )}

        {/* New Goal Modal */}
        {showModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <ParchmentCard className="max-w-md w-full p-6">
              <h2 className="text-2xl font-display font-semibold mb-4" style={{ color: 'var(--color-crimson)' }}>
                New Learning Goal
              </h2>

              {isCreating ? (
                <div className="flex flex-col items-center py-8">
                  <QuillLoader />
                  <p className="mt-4 text-center" style={{ color: 'var(--color-ink)' }}>
                    Creating your goal...
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label htmlFor="goal-input" className="block mb-2" style={{ color: 'var(--color-ink)' }}>
                      Goal Description
                    </label>
                    <Input
                      id="goal-input"
                      value={newGoalInput}
                      onChange={(e) => setNewGoalInput(e.target.value)}
                      placeholder="e.g., Learn TypeScript"
                      aria-label="Goal description"
                    />
                  </div>

                  {error && (
                    <p className="mb-4 text-sm text-crimson-light dark:text-crimson-dark">
                      Error: {error}
                    </p>
                  )}

                  <div className="flex gap-4">
                    <Button onClick={handleCreateGoal} className="flex-1">
                      Start Learning
                    </Button>
                    <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </ParchmentCard>
          </div>
        )}
      </div>
    </main>
  );
}
