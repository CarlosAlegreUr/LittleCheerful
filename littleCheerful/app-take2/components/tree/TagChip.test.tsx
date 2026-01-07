import { render, screen } from '@testing-library/react';
import { TagChip } from './TagChip';

describe('TagChip', () => {
  it('renders without crashing', () => {
    render(<TagChip tag="intuitive" variant="intuitive" />);
    expect(screen.getByText('intuitive')).toBeInTheDocument();
  });

  it('displays tag text correctly', () => {
    render(<TagChip tag="formal-logic" variant="formal" />);
    expect(screen.getByText('formal-logic')).toBeInTheDocument();
  });

  it('applies crimson styling for intuitive variant', () => {
    const { container } = render(<TagChip tag="test" variant="intuitive" />);
    const chip = container.firstChild as HTMLElement;
    expect(chip).toHaveClass('bg-crimson-light');
    expect(chip).toHaveClass('dark:bg-crimson-dark');
  });

  it('applies ink styling for formal variant', () => {
    const { container } = render(<TagChip tag="test" variant="formal" />);
    const chip = container.firstChild as HTMLElement;
    expect(chip).toHaveClass('bg-ink-light');
    expect(chip).toHaveClass('dark:bg-ink-dark');
  });

  it('applies gold styling for can-apply variant', () => {
    const { container } = render(<TagChip tag="test" variant="can-apply" />);
    const chip = container.firstChild as HTMLElement;
    expect(chip).toHaveClass('bg-gold-light');
    expect(chip).toHaveClass('dark:bg-gold-dark');
  });

  it('renders as pill-shaped chip', () => {
    const { container } = render(<TagChip tag="test" variant="intuitive" />);
    const chip = container.firstChild as HTMLElement;
    expect(chip).toHaveClass('rounded-full');
  });

  it('has appropriate small size', () => {
    const { container } = render(<TagChip tag="test" variant="intuitive" />);
    const chip = container.firstChild as HTMLElement;
    // Caption text size from ux-design.md (0.75rem / 12px)
    expect(chip).toHaveClass('text-xs');
  });

  it('has proper padding for pill shape', () => {
    const { container } = render(<TagChip tag="test" variant="intuitive" />);
    const chip = container.firstChild as HTMLElement;
    // Horizontal padding should be more than vertical for pill shape
    expect(chip).toHaveClass('px-3');
    expect(chip).toHaveClass('py-1');
  });

  it('has accessible role', () => {
    render(<TagChip tag="accessibility-test" variant="formal" />);
    const chip = screen.getByText('accessibility-test');
    expect(chip.closest('[role="status"]')).toBeInTheDocument();
  });

  it('displays with appropriate text color for readability', () => {
    const { container } = render(<TagChip tag="test" variant="intuitive" />);
    const chip = container.firstChild as HTMLElement;
    // Text should contrast with background
    expect(chip).toHaveClass('text-parchment-light');
    expect(chip).toHaveClass('dark:text-parchment-dark');
  });

  it('uses inline-flex for proper sizing', () => {
    const { container } = render(<TagChip tag="test" variant="intuitive" />);
    const chip = container.firstChild as HTMLElement;
    expect(chip).toHaveClass('inline-flex');
    expect(chip).toHaveClass('items-center');
  });

  it('handles long tag text gracefully', () => {
    const longTag = 'very-long-tag-name-for-testing';
    render(<TagChip tag={longTag} variant="formal" />);
    expect(screen.getByText(longTag)).toBeInTheDocument();
  });

  it('applies dark mode styling', () => {
    const { container } = render(<TagChip tag="test" variant="can-apply" />);
    const chip = container.firstChild as HTMLElement;
    // Should have dark mode variants
    expect(chip.className).toContain('dark:');
  });

  it('maintains Roman library aesthetic', () => {
    const { container } = render(<TagChip tag="test" variant="intuitive" />);
    const chip = container.firstChild as HTMLElement;
    // Should use serif font family from design system
    expect(chip).toHaveClass('font-serif');
  });
});
