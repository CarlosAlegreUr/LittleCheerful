import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LearnPage from './page';

// Mock fetch
global.fetch = jest.fn();

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('LearnPage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render goal list heading', () => {
    render(<LearnPage />);
    expect(screen.getByText(/your learning goals/i)).toBeInTheDocument();
  });

  it('should fetch and display existing goals from global-progress.json', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        goals: [
          { name: 'JavaScript Fundamentals', progress: 45 },
          { name: 'React Patterns', progress: 20 },
        ],
      }),
    });

    render(<LearnPage />);

    await waitFor(() => {
      expect(screen.getByText(/JavaScript Fundamentals/i)).toBeInTheDocument();
      expect(screen.getByText(/React Patterns/i)).toBeInTheDocument();
    });
  });

  it('should have "New Goal" button', () => {
    render(<LearnPage />);
    expect(screen.getByRole('button', { name: /new goal/i })).toBeInTheDocument();
  });

  it('should open modal when "New Goal" clicked', () => {
    render(<LearnPage />);

    const newGoalButton = screen.getByRole('button', { name: /new goal/i });
    fireEvent.click(newGoalButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/goal description/i)).toBeInTheDocument();
  });

  it('should POST new goal to /api/learning/start', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        goalName: 'test-goal',
        status: 'started',
      }),
    });

    render(<LearnPage />);

    const newGoalButton = screen.getByRole('button', { name: /new goal/i });
    fireEvent.click(newGoalButton);

    const input = screen.getByLabelText(/goal description/i);
    fireEvent.change(input, { target: { value: 'Learn TypeScript' } });

    const submitButton = screen.getByRole('button', { name: /start learning/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/learning/start',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ goal: 'Learn TypeScript' }),
        })
      );
    });
  });

  it('should navigate to goal page after creation', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        goalName: 'learn-typescript',
        status: 'started',
      }),
    });

    render(<LearnPage />);

    const newGoalButton = screen.getByRole('button', { name: /new goal/i });
    fireEvent.click(newGoalButton);

    const input = screen.getByLabelText(/goal description/i);
    fireEvent.change(input, { target: { value: 'Learn TypeScript' } });

    const submitButton = screen.getByRole('button', { name: /start learning/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/learn/learn-typescript');
    });
  });

  it('should show loading state during goal creation', async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (global.fetch as jest.Mock).mockReturnValueOnce(promise);

    render(<LearnPage />);

    const newGoalButton = screen.getByRole('button', { name: /new goal/i });
    fireEvent.click(newGoalButton);

    const input = screen.getByLabelText(/goal description/i);
    fireEvent.change(input, { target: { value: 'Learn TypeScript' } });

    const submitButton = screen.getByRole('button', { name: /start learning/i });
    fireEvent.click(submitButton);

    expect(screen.getByTestId('quill-loader')).toBeInTheDocument();

    resolvePromise!({
      ok: true,
      json: async () => ({ goalName: 'test', status: 'started' }),
    });
  });

  it('should show error state on creation failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to create goal')
    );

    render(<LearnPage />);

    const newGoalButton = screen.getByRole('button', { name: /new goal/i });
    fireEvent.click(newGoalButton);

    const input = screen.getByLabelText(/goal description/i);
    fireEvent.change(input, { target: { value: 'Learn TypeScript' } });

    const submitButton = screen.getByRole('button', { name: /start learning/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
