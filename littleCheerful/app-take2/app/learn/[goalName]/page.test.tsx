import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GoalPage from './page';

// Mock fetch
global.fetch = jest.fn();

// Mock useParams
jest.mock('next/navigation', () => ({
  useParams: () => ({
    goalName: 'test-goal',
  }),
}));

describe('GoalPage (Chat + Tree) Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render chat interface and tree sidebar', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          goal: 'test-goal',
          tree: {},
          total_concepts: 0,
        }),
      });

    const props = { params: Promise.resolve({ goalName: 'test-goal' }) };
    render(await GoalPage(props));

    expect(screen.getByRole('region', { name: /chat interface/i })).toBeInTheDocument();
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  it('should fetch tree data on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        goal: 'test-goal',
        tree: {
          'root': {
            status: 'NOT_STARTED',
            tags: ['intuitive'],
            parent: null,
            children: [],
            last_reviewed: null,
          },
        },
        total_concepts: 1,
      }),
    });

    const props = { params: Promise.resolve({ goalName: 'test-goal' }) };
    render(await GoalPage(props));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tree/test-goal');
    });
  });

  it('should send chat message on submit', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ goal: 'test-goal', tree: {}, total_concepts: 0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        body: new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('data: Hello\n'));
            controller.close();
          },
        }),
      });

    const props = { params: Promise.resolve({ goalName: 'test-goal' }) };
    render(await GoalPage(props));

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'What is JavaScript?' } });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/chat/stream',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ message: 'What is JavaScript?' }),
        })
      );
    });
  });

  it('should display streaming response from chat', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('data: Hello '));
        controller.enqueue(new TextEncoder().encode('data: there!\n'));
        controller.close();
      },
    });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ goal: 'test-goal', tree: {}, total_concepts: 0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        body: stream,
      });

    const props = { params: Promise.resolve({ goalName: 'test-goal' }) };
    render(await GoalPage(props));

    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Hi' } });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Hello there!/i)).toBeInTheDocument();
    });
  });

  it('should update chat context when tree node clicked', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          goal: 'test-goal',
          tree: {
            'variables': {
              status: 'NOT_STARTED',
              tags: ['intuitive'],
              parent: null,
              children: [],
              last_reviewed: null,
            },
          },
          total_concepts: 1,
        }),
      });

    const props = { params: Promise.resolve({ goalName: 'test-goal' }) };
    render(await GoalPage(props));

    await waitFor(() => {
      const treeNode = screen.getByText(/variables/i);
      expect(treeNode).toBeInTheDocument();
    });

    const treeNode = screen.getByText(/variables/i);
    fireEvent.click(treeNode);

    // Chat should show context message
    expect(screen.getByText(/selected: variables/i)).toBeInTheDocument();
  });

  it('should show QuillLoader during tree generation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ goal: 'test-goal', tree: {}, total_concepts: 0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'job-123',
          status: 'running',
          type: 'tree-generation',
          createdAt: new Date().toISOString(),
        }),
      });

    const props = { params: Promise.resolve({ goalName: 'test-goal' }) };
    render(await GoalPage(props));

    // Trigger tree generation
    const generateButton = screen.getByRole('button', { name: /generate tree/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByTestId('quill-loader')).toBeInTheDocument();
    });
  });

  it('should poll job status during tree generation', async () => {
    jest.useFakeTimers();

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ goal: 'test-goal', tree: {}, total_concepts: 0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'job-123',
          status: 'running',
          type: 'tree-generation',
          createdAt: new Date().toISOString(),
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'job-123',
          status: 'running',
          type: 'tree-generation',
          createdAt: new Date().toISOString(),
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'job-123',
          status: 'completed',
          type: 'tree-generation',
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        }),
      });

    const props = { params: Promise.resolve({ goalName: 'test-goal' }) };
    render(await GoalPage(props));

    const generateButton = screen.getByRole('button', { name: /generate tree/i });
    fireEvent.click(generateButton);

    // Advance timers to trigger polling
    jest.advanceTimersByTime(4000);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/jobs/job-123');
    });

    jest.useRealTimers();
  });

  it('should show error boundary on API failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch tree')
    );

    const props = { params: Promise.resolve({ goalName: 'test-goal' }) };
    render(await GoalPage(props));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
