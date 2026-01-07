import { renderHook, act, waitFor } from '@testing-library/react';
import { useChat } from './useChat';

// Mock fetch for SSE streaming
global.fetch = jest.fn();

describe('useChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useChat());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sends message and handles SSE streaming response', async () => {
    // Mock SSE stream response
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: Hello\n\n'),
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data:  World\n\n'),
        })
        .mockResolvedValueOnce({
          done: true,
          value: undefined,
        }),
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Test message');
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    // User message
    expect(result.current.messages[0]).toMatchObject({
      role: 'user',
      content: 'Test message',
    });

    // Assistant streaming message
    expect(result.current.messages[1]).toMatchObject({
      role: 'assistant',
      content: 'Hello World',
    });

    expect(result.current.isStreaming).toBe(false);
  });

  it('handles API errors correctly', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Test message');
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.error).toContain('Network error');
    expect(result.current.isStreaming).toBe(false);
  });

  it('sets isStreaming to true during message sending', async () => {
    const mockReader = {
      read: jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ done: true, value: undefined });
          }, 100);
        });
      }),
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    const { result } = renderHook(() => useChat());

    let streamingDuringCall = false;

    await act(async () => {
      const promise = result.current.sendMessage('Test');
      // Check streaming state immediately after call
      streamingDuringCall = result.current.isStreaming;
      await promise;
    });

    expect(streamingDuringCall).toBe(true);
    expect(result.current.isStreaming).toBe(false);
  });

  it('accumulates streaming chunks correctly', async () => {
    const chunks = ['Hello', ' ', 'from', ' ', 'the', ' ', 'stream'];
    const mockReader = {
      read: jest.fn(),
    };

    // Setup mock to return chunks sequentially
    chunks.forEach((chunk) => {
      mockReader.read.mockResolvedValueOnce({
        done: false,
        value: new TextEncoder().encode(`data: ${chunk}\n\n`),
      });
    });
    mockReader.read.mockResolvedValueOnce({
      done: true,
      value: undefined,
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    expect(result.current.messages[1].content).toBe('Hello from the stream');
  });

  it('cleans up on unmount', () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

    const { unmount } = renderHook(() => useChat());

    unmount();

    // Verify abort controller was called on unmount
    expect(abortSpy).toHaveBeenCalled();
  });
});
