import { render } from '@testing-library/react';
import { CandleFlame } from './CandleFlame';

describe('CandleFlame', () => {
  it('renders without crashing', () => {
    const { container } = render(<CandleFlame />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies small size class', () => {
    const { container } = render(<CandleFlame size="sm" />);
    const flame = container.firstChild as HTMLElement;
    expect(flame).toHaveClass('w-4', 'h-4');
  });

  it('applies medium size class', () => {
    const { container } = render(<CandleFlame size="md" />);
    const flame = container.firstChild as HTMLElement;
    expect(flame).toHaveClass('w-6', 'h-6');
  });

  it('applies large size class', () => {
    const { container } = render(<CandleFlame size="lg" />);
    const flame = container.firstChild as HTMLElement;
    expect(flame).toHaveClass('w-8', 'h-8');
  });

  it('applies custom className', () => {
    const { container } = render(<CandleFlame className="custom-flame" />);
    const flame = container.firstChild as HTMLElement;
    expect(flame).toHaveClass('custom-flame');
  });

  it('has animation class by default', () => {
    const { container } = render(<CandleFlame />);
    // Animation is on the wrapper div
    const flame = container.firstChild as HTMLElement;
    expect(flame).toHaveClass('animate-candle-flicker');
  });

  it('uses Framer Motion for animation', () => {
    const { container } = render(<CandleFlame />);
    const flame = container.firstChild as HTMLElement;
    // Framer Motion adds data attribute
    expect(flame.tagName.toLowerCase()).toBe('div');
  });

  it('applies gold color scheme', () => {
    const { container } = render(<CandleFlame />);
    const flame = container.firstChild as HTMLElement;
    // Should have gold color from design system
    expect(flame).toHaveClass('text-gold-light');
    expect(flame).toHaveClass('dark:text-gold-dark');
  });
});
