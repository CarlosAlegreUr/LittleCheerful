import { render, screen, waitFor } from '@testing-library/react';
import HomePage from './page';

// Mock fetch
global.fetch = jest.fn();

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('HomePage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/Little Cheerful/i)).toBeInTheDocument();
    });
  });

  it('should check if profile exists on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/profile/exists', {
        method: 'HEAD',
      });
    });
  });

  it('should show EasterEgg when no profile exists', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('easter-egg-overlay')).toBeInTheDocument();
    });
  });

  it('should redirect to /learn when profile exists', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/learn');
    });
  });

  it('should have theme toggle button', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
    });
  });
});
