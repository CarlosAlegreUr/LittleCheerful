import { renderHook, act, waitFor } from '@testing-library/react';
import { useJob } from './useJob';
import type { JobStatus } from '@/lib/types';

// Mock fetch
global.fetch = jest.fn();

const mockJobPending: JobStatus = {
  id: 'job-123',
  type: 'tree-generation',
  status: 'pending',
  createdAt: '2024-01-01T00:00:00Z',
};

const mockJobRunning: JobStatus = {
  id: 'job-123',
  type: 'tree-generation',
  status: 'running',
  progress: 50,
  message: 'Generating tree...',
  createdAt: '2024-01-01T00:00:00Z',
};

const mockJobCompleted: JobStatus = {
  id: 'job-123',
  type: 'tree-generation',
  status: 'completed',
  progress: 100,
  result: { treeData: 'completed' },
  createdAt: '2024-01-01T00:00:00Z',
  completedAt: '2024-01-01T00:02:00Z',
};

const mockJobFailed: JobStatus = {
  id: 'job-123',
  type: 'tree-generation',
  status: 'failed',
  error: 'Generation failed',
  createdAt: '2024-01-01T00:00:00Z',
  completedAt: '2024-01-01T00:01:00Z',
};

describe('useJob', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useJob('job-123', false));

    expect(result.current.job).toBeNull();
    expect(result.current.isPolling).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('does not poll when enabled is false', async () => {
    const { result } = renderHook(() => useJob('job-123', false));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.isPolling).toBe(false);
  });

  it('polls job status every 2 seconds when enabled', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockJobRunning,
    });

    const { result } = renderHook(() => useJob('job-123', true));

    // Initial fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(result.current.isPolling).toBe(true);

    // Wait 2 seconds for next poll
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    // Wait another 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    expect(result.current.job).toEqual(mockJobRunning);
  });

  it('stops polling when job completes', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobRunning,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobCompleted,
      });

    const { result } = renderHook(() => useJob('job-123', true));

    // Initial fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Wait for second poll
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.job?.status).toBe('completed');
    });

    expect(result.current.isPolling).toBe(false);

    // Should not poll again after completion
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('stops polling when job fails', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobRunning,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobFailed,
      });

    const { result } = renderHook(() => useJob('job-123', true));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.job?.status).toBe('failed');
    });

    expect(result.current.isPolling).toBe(false);

    // Should not poll again after failure
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('allows manual stop of polling', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockJobRunning,
    });

    const { result } = renderHook(() => useJob('job-123', true));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(result.current.isPolling).toBe(true);

    act(() => {
      result.current.stopPolling();
    });

    expect(result.current.isPolling).toBe(false);

    // Should not continue polling after manual stop
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles fetch errors during polling', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useJob('job-123', true));

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.error).toContain('Network error');
    expect(result.current.isPolling).toBe(false);
  });

  it('cleans up interval on unmount', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockJobRunning,
    });

    const { result, unmount } = renderHook(() => useJob('job-123', true));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    unmount();

    // Should not poll after unmount
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('restarts polling when enabled changes from false to true', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockJobRunning,
    });

    const { result, rerender } = renderHook(
      ({ enabled }) => useJob('job-123', enabled),
      {
        initialProps: { enabled: false },
      }
    );

    expect(result.current.isPolling).toBe(false);

    // Enable polling
    rerender({ enabled: true });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(result.current.isPolling).toBe(true);
  });

  it('stops polling when enabled changes from true to false', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockJobRunning,
    });

    const { result, rerender } = renderHook(
      ({ enabled }) => useJob('job-123', enabled),
      {
        initialProps: { enabled: true },
      }
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(result.current.isPolling).toBe(true);

    // Disable polling
    rerender({ enabled: false });

    expect(result.current.isPolling).toBe(false);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should not poll again
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('fetches different job when jobId changes', async () => {
    const job2: JobStatus = { ...mockJobRunning, id: 'job-456' };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobRunning,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => job2,
      });

    const { result, rerender } = renderHook(
      ({ jobId }) => useJob(jobId, true),
      {
        initialProps: { jobId: 'job-123' },
      }
    );

    await waitFor(() => {
      expect(result.current.job?.id).toBe('job-123');
    });

    // Change jobId
    rerender({ jobId: 'job-456' });

    await waitFor(() => {
      expect(result.current.job?.id).toBe('job-456');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/jobs/job-123');
    expect(global.fetch).toHaveBeenCalledWith('/api/jobs/job-456');
  });
});
