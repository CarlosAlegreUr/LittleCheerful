import { renderHook, act, waitFor } from '@testing-library/react';
import { useTree } from './useTree';
import type { TreeStructure } from '@/lib/types';

// Mock fetch
global.fetch = jest.fn();

const mockTreeData: TreeStructure = {
  goal: 'test-goal',
  created: '2024-01-01',
  last_updated: '2024-01-01',
  max_concepts: 10,
  total_concepts: 5,
  tree: {
    'concept-1': {
      status: 'NOT_STARTED',
      tags: ['intuitive'],
      last_reviewed: null,
      parent: null,
      children: ['concept-2'],
    },
    'concept-2': {
      status: 'IN_PROGRESS',
      tags: ['formal'],
      last_reviewed: '2024-01-01',
      parent: 'concept-1',
      children: [],
    },
  },
};

describe('useTree', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useTree('test-goal'));

    expect(result.current.tree).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches tree data on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTreeData,
    });

    const { result } = renderHook(() => useTree('test-goal'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tree).toEqual(mockTreeData);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith('/api/tree/test-goal');
  });

  it('handles fetch errors correctly', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useTree('test-goal'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tree).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toContain('Failed to fetch');
  });

  it('caches tree data and does not refetch on re-render', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTreeData,
    });

    const { result, rerender } = renderHook(() => useTree('test-goal'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Re-render should not trigger new fetch
    rerender();

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('refetches data when refetch is called', async () => {
    const updatedTreeData = { ...mockTreeData, total_concepts: 8 };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTreeData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => updatedTreeData,
      });

    const { result } = renderHook(() => useTree('test-goal'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tree?.total_concepts).toBe(5);

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.tree?.total_concepts).toBe(8);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('fetches different tree when goalName changes', async () => {
    const tree2Data = { ...mockTreeData, goal: 'test-goal-2' };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTreeData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => tree2Data,
      });

    const { result, rerender } = renderHook(
      ({ goalName }) => useTree(goalName),
      {
        initialProps: { goalName: 'test-goal' },
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tree?.goal).toBe('test-goal');

    // Change goalName
    rerender({ goalName: 'test-goal-2' });

    await waitFor(() => {
      expect(result.current.tree?.goal).toBe('test-goal-2');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/tree/test-goal');
    expect(global.fetch).toHaveBeenCalledWith('/api/tree/test-goal-2');
  });

  it('handles 404 errors gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const { result } = renderHook(() => useTree('nonexistent-goal'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tree).toBeNull();
    expect(result.current.error).toContain('404');
  });
});
