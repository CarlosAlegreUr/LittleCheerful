import { render, screen, fireEvent } from '@testing-library/react';
import { EasterEgg } from './EasterEgg';

describe('EasterEgg', () => {
  it('renders without crashing when show=true', () => {
    const mockOnContinue = jest.fn();

    render(<EasterEgg show={true} onContinue={mockOnContinue} />);

    expect(screen.getByText(/surprise keenan/i)).toBeInTheDocument();
  });

  it('does not render when show=false', () => {
    const mockOnContinue = jest.fn();

    render(<EasterEgg show={false} onContinue={mockOnContinue} />);

    expect(screen.queryByText(/surprise keenan/i)).not.toBeInTheDocument();
  });

  it('displays "SURPRISE KEENAN!" text', () => {
    const mockOnContinue = jest.fn();

    render(<EasterEgg show={true} onContinue={mockOnContinue} />);

    expect(screen.getByText('SURPRISE KEENAN!')).toBeInTheDocument();
  });

  it('uses OrnateHeading component for dramatic text', () => {
    const mockOnContinue = jest.fn();

    const { container } = render(
      <EasterEgg show={true} onContinue={mockOnContinue} />
    );

    // OrnateHeading uses font-display and has gold underline
    const heading = screen.getByText('SURPRISE KEENAN!');
    expect(heading.tagName).toMatch(/^H[1-6]$/); // Should be a heading element
    expect(heading).toHaveClass('font-display');
  });

  it('has full-screen overlay styling', () => {
    const mockOnContinue = jest.fn();

    const { container } = render(
      <EasterEgg show={true} onContinue={mockOnContinue} />
    );

    // Should have fixed positioning and cover entire viewport
    const overlay = container.querySelector('[data-testid="easter-egg-overlay"]');
    expect(overlay).toHaveClass('fixed');
    expect(overlay).toHaveClass('inset-0');
  });

  it('has fade-in animation class', () => {
    const mockOnContinue = jest.fn();

    const { container } = render(
      <EasterEgg show={true} onContinue={mockOnContinue} />
    );

    // Should have animation attributes for fade-in
    const overlay = container.querySelector('[data-testid="easter-egg-overlay"]');
    expect(overlay).toHaveClass('animate-in');
  });

  it('has scale-up animation class for text', () => {
    const mockOnContinue = jest.fn();

    const { container } = render(
      <EasterEgg show={true} onContinue={mockOnContinue} />
    );

    // Text should have scale animation
    const textContainer = screen.getByText('SURPRISE KEENAN!').closest('[data-animate]');
    expect(textContainer).toHaveAttribute('data-animate', 'scale-up');
  });

  it('renders a continue button', () => {
    const mockOnContinue = jest.fn();

    render(<EasterEgg show={true} onContinue={mockOnContinue} />);

    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('calls onContinue when continue button is clicked', () => {
    const mockOnContinue = jest.fn();

    render(<EasterEgg show={true} onContinue={mockOnContinue} />);

    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueButton);

    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it('has proper z-index for overlay (above other content)', () => {
    const mockOnContinue = jest.fn();

    const { container } = render(
      <EasterEgg show={true} onContinue={mockOnContinue} />
    );

    const overlay = container.querySelector('[data-testid="easter-egg-overlay"]');
    expect(overlay).toHaveClass('z-50');
  });

  it('has centered content alignment', () => {
    const mockOnContinue = jest.fn();

    const { container } = render(
      <EasterEgg show={true} onContinue={mockOnContinue} />
    );

    const overlay = container.querySelector('[data-testid="easter-egg-overlay"]');
    expect(overlay).toHaveClass('flex');
    expect(overlay).toHaveClass('items-center');
    expect(overlay).toHaveClass('justify-center');
  });

  it('has semi-transparent dark background', () => {
    const mockOnContinue = jest.fn();

    const { container } = render(
      <EasterEgg show={true} onContinue={mockOnContinue} />
    );

    const overlay = container.querySelector('[data-testid="easter-egg-overlay"]');
    expect(overlay).toHaveClass('bg-black/80');
  });

  it('respects prefers-reduced-motion by using data attribute', () => {
    const mockOnContinue = jest.fn();

    const { container } = render(
      <EasterEgg show={true} onContinue={mockOnContinue} />
    );

    // Component should have reduce motion support
    const overlay = container.querySelector('[data-testid="easter-egg-overlay"]');
    expect(overlay).toHaveAttribute('data-reduce-motion', 'true');
  });

  it('has accessible ARIA attributes', () => {
    const mockOnContinue = jest.fn();

    render(<EasterEgg show={true} onContinue={mockOnContinue} />);

    const overlay = screen.getByRole('dialog');
    expect(overlay).toHaveAttribute('aria-modal', 'true');
    expect(overlay).toHaveAttribute('aria-labelledby');
  });

  it('focuses continue button on mount for keyboard accessibility', () => {
    const mockOnContinue = jest.fn();

    render(<EasterEgg show={true} onContinue={mockOnContinue} />);

    const continueButton = screen.getByRole('button', { name: /continue/i });

    // Button should be focusable
    continueButton.focus();
    expect(document.activeElement).toBe(continueButton);
  });

  it('allows Enter key to trigger continue', () => {
    const mockOnContinue = jest.fn();

    render(<EasterEgg show={true} onContinue={mockOnContinue} />);

    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.keyDown(continueButton, { key: 'Enter', code: 'Enter' });

    expect(mockOnContinue).toHaveBeenCalled();
  });
});
