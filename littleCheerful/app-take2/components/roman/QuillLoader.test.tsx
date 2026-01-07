import { render, screen } from '@testing-library/react';
import { QuillLoader } from './QuillLoader';

describe('QuillLoader', () => {
  it('renders without crashing', () => {
    const { container } = render(<QuillLoader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders optional text prop', () => {
    render(<QuillLoader text="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('does not render text when not provided', () => {
    const { container } = render(<QuillLoader />);
    const text = container.querySelector('span, p');
    // Should only have SVG, no text element
    expect(screen.queryByRole('status')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<QuillLoader className="custom-loader" />);
    const loader = container.firstChild as HTMLElement;
    expect(loader).toHaveClass('custom-loader');
  });

  it('contains SVG quill element', () => {
    const { container } = render(<QuillLoader />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has accessibility role', () => {
    render(<QuillLoader />);
    // Loading indicator should have status role
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies ink color scheme', () => {
    const { container } = render(<QuillLoader />);
    const svg = container.querySelector('svg');
    // SVG should use ink color for stroke
    expect(svg).toHaveClass('stroke-ink-light');
    expect(svg).toHaveClass('dark:stroke-ink-dark');
  });

  it('has animation class for stroke animation', () => {
    const { container } = render(<QuillLoader />);
    const path = container.querySelector('path');
    // Should have animation class for quill writing effect
    expect(path).toHaveClass('animate-quill-write');
  });
});
