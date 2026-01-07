import { useState, useEffect, useCallback } from 'react';
import type { TreeStructure } from '@/lib/types';

interface UseTreeReturn {
  tree: TreeStructure | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTree(goalName: string): UseTreeReturn {
  const [tree, setTree] = useState<TreeStructure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTree = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/tree/${goalName}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTree(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [goalName]);

  // Fetch on mount and when goalName changes
  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const refetch = useCallback(async () => {
    await fetchTree();
  }, [fetchTree]);

  return {
    tree,
    isLoading,
    error,
    refetch,
  };
}
