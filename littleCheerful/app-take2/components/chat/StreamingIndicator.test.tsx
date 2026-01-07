import { render, screen } from '@testing-library/react';
import { StreamingIndicator } from './StreamingIndicator';

describe('StreamingIndicator', () => {
  it('renders without crashing when visible', () => {
    render(<StreamingIndicator visible={true} />);
    expect(screen.getByText(/claude is writing/i)).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    const { container } = render(<StreamingIndicator visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays QuillLoader animation', () => {
    const { container } = render(<StreamingIndicator visible={true} />);

    // QuillLoader should be present
    expect(container.querySelector('[data-testid="quill-loader"]')).toBeInTheDocument();
  });

  it('displays typing text', () => {
    render(<StreamingIndicator visible={true} />);
    expect(screen.getByText(/claude is writing/i)).toBeInTheDocument();
  });

  it('has aria-live polite for accessibility', () => {
    render(<StreamingIndicator visible={true} />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  });

  it('has aria-busy when visible', () => {
    render(<StreamingIndicator visible={true} />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-busy', 'true');
  });

  it('applies proper styling', () => {
    const { container } = render(<StreamingIndicator visible={true} />);

    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('flex');
    expect(indicator).toHaveClass('items-center');
  });

  it('uses Roman theme colors', () => {
    const { container } = render(<StreamingIndicator visible={true} />);

    const text = screen.getByText(/claude is writing/i);
    expect(text).toHaveClass('text-ink-light');
  });

  it('applies proper spacing between loader and text', () => {
    const { container } = render(<StreamingIndicator visible={true} />);

    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('gap-2');
  });

  it('has accessible role', () => {
    render(<StreamingIndicator visible={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
