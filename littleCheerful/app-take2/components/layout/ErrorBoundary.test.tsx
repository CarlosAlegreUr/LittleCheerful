import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// Test component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error heading
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('uses InkBlot component for error display', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // InkBlot should be present (check for its characteristic classes or structure)
    expect(container.querySelector('.relative')).toBeInTheDocument();
  });

  it('does not render error UI when no error thrown', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});
