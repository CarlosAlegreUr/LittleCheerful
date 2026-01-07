import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SetupPage from './page';

// Mock fetch
global.fetch = jest.fn();

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('SetupPage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render wizard container', () => {
    render(<SetupPage />);
    expect(screen.getByLabelText(/wizard navigation/i)).toBeInTheDocument();
  });

  it('should render all 6 wizard steps', () => {
    render(<SetupPage />);
    // Check for Roman numerals I through VI
    expect(screen.getByText('I')).toBeInTheDocument();
    expect(screen.getByText('VI')).toBeInTheDocument();
  });

  it('should allow navigation between steps', () => {
    render(<SetupPage />);

    // Should start at step 1
    const nextButton = screen.getByText(/next/i);
    expect(nextButton).toBeInTheDocument();

    // Click next to go to step 2
    fireEvent.click(nextButton);

    // Previous button should now be visible
    expect(screen.getByText(/previous/i)).toBeInTheDocument();
  });

  it('should POST profile on completion', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        teaching_tone: 'balanced',
        motivation_style: 'positive-reinforcement',
        default_source_depth: 2,
        terminology_level: 'adaptive',
        example_preferences: 'both',
        preferred_language: 'en',
        created: new Date().toISOString(),
      }),
    });

    render(<SetupPage />);

    // Navigate to last step
    const nextButton = screen.getByText(/next/i);
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }

    // Complete wizard
    const completeButton = screen.getByText(/complete/i);
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/profile',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  it('should redirect to /learn after successful save', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ created: new Date().toISOString() }),
    });

    render(<SetupPage />);

    // Navigate to last step and complete
    const nextButton = screen.getByText(/next/i);
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }

    const completeButton = screen.getByText(/complete/i);
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/learn');
    });
  });

  it('should show loading state during save', async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (global.fetch as jest.Mock).mockReturnValueOnce(promise);

    render(<SetupPage />);

    // Navigate to last step and complete
    const nextButton = screen.getByText(/next/i);
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }

    const completeButton = screen.getByText(/complete/i);
    fireEvent.click(completeButton);

    // Should show loading indicator
    expect(screen.getByTestId('quill-loader')).toBeInTheDocument();

    // Resolve promise
    resolvePromise!({
      ok: true,
      json: async () => ({ created: new Date().toISOString() }),
    });
  });

  it('should show error state on save failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    render(<SetupPage />);

    // Navigate to last step and complete
    const nextButton = screen.getByText(/next/i);
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }

    const completeButton = screen.getByText(/complete/i);
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
