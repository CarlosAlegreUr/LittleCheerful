import { useState, useEffect, useCallback, useRef } from 'react';
import type { JobStatus } from '@/lib/types';

interface UseJobReturn {
  job: JobStatus | null;
  isPolling: boolean;
  error: string | null;
  stopPolling: () => void;
}

export function useJob(jobId: string, enabled: boolean): UseJobReturn {
  const [job, setJob] = useState<JobStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldPollRef = useRef(enabled);

  // Update shouldPollRef when enabled changes
  useEffect(() => {
    shouldPollRef.current = enabled;
  }, [enabled]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    shouldPollRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchJob = useCallback(async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJob(data);

      // Stop polling if job is completed or failed
      if (data.status === 'completed' || data.status === 'failed') {
        stopPolling();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      stopPolling();
    }
  }, [jobId, stopPolling]);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!enabled) {
      setIsPolling(false);
      return;
    }

    // Start polling
    setIsPolling(true);
    shouldPollRef.current = true;

    // Initial fetch
    fetchJob();

    // Set up polling interval (2 seconds)
    intervalRef.current = setInterval(() => {
      if (shouldPollRef.current) {
        fetchJob();
      }
    }, 2000);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [jobId, enabled, fetchJob]);

  return {
    job,
    isPolling,
    error,
    stopPolling,
  };
}
