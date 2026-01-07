import { renderHook, act, waitFor } from '@testing-library/react';
import { useProfile } from './useProfile';
import type { LearningProfile } from '@/lib/types';

// Mock fetch
global.fetch = jest.fn();

const mockProfile: LearningProfile = {
  teaching_tone: 'balanced',
  motivation_style: 'positive-reinforcement',
  default_source_depth: 2,
  terminology_level: 'adaptive',
  example_preferences: 'both',
  preferred_language: 'English',
  created: '2024-01-01',
  last_updated: '2024-01-01',
};

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useProfile());

    expect(result.current.profile).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches profile data on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProfile,
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith('/api/profile');
  });

  it('handles profile not found (404) as empty profile', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBeNull(); // 404 is not an error for profile
  });

  it('handles other fetch errors correctly', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toContain('Network error');
  });

  it('updates profile and syncs with API', async () => {
    const updatedProfile: LearningProfile = {
      ...mockProfile,
      teaching_tone: 'direct',
      terminology_level: 'academic',
    };

    // Initial fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfile,
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Update profile
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => updatedProfile,
    });

    await act(async () => {
      await result.current.updateProfile({
        teaching_tone: 'direct',
        terminology_level: 'academic',
      });
    });

    await waitFor(() => {
      expect(result.current.profile?.teaching_tone).toBe('direct');
    });

    expect(result.current.profile).toMatchObject({
      teaching_tone: 'direct',
      terminology_level: 'academic',
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teaching_tone: 'direct',
        terminology_level: 'academic',
      }),
    });
  });

  it('handles update errors correctly', async () => {
    // Initial fetch succeeds
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfile,
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Update fails
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Update failed')
    );

    await act(async () => {
      await result.current.updateProfile({ teaching_tone: 'direct' });
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.error).toContain('Update failed');
    // Profile should remain unchanged on error
    expect(result.current.profile?.teaching_tone).toBe('balanced');
  });

  it('sets loading state during update', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProfile,
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let loadingDuringUpdate = false;

    await act(async () => {
      const promise = result.current.updateProfile({ teaching_tone: 'direct' });
      loadingDuringUpdate = result.current.isLoading;
      await promise;
    });

    expect(loadingDuringUpdate).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('merges partial updates with existing profile', async () => {
    const updatedProfile = { ...mockProfile, teaching_tone: 'direct' as const };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => updatedProfile,
      });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateProfile({ teaching_tone: 'direct' });
    });

    await waitFor(() => {
      expect(result.current.profile?.teaching_tone).toBe('direct');
    });

    // Other fields should remain unchanged
    expect(result.current.profile?.motivation_style).toBe(
      'positive-reinforcement'
    );
    expect(result.current.profile?.default_source_depth).toBe(2);
  });
});
