import { render, screen } from '@testing-library/react';
import { ProgressBadge } from './ProgressBadge';
import { ConceptStatus } from '@/lib/types';

describe('ProgressBadge', () => {
  it('renders without crashing', () => {
    render(<ProgressBadge status="NOT_STARTED" percentage={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('displays percentage text correctly', () => {
    render(<ProgressBadge status="IN_PROGRESS" percentage={45} />);
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('displays 100% for studied status', () => {
    render(<ProgressBadge status="STUDIED" percentage={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('applies gray styling for NOT_STARTED status', () => {
    const { container } = render(
      <ProgressBadge status="NOT_STARTED" percentage={0} />
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-disabled');
    expect(badge).toHaveClass('text-parchment-light');
  });

  it('applies blue styling for IN_PROGRESS status', () => {
    const { container } = render(
      <ProgressBadge status="IN_PROGRESS" percentage={50} />
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-info-light');
    expect(badge).toHaveClass('dark:bg-info-dark');
  });

  it('applies gold styling for STUDIED status', () => {
    const { container } = render(
      <ProgressBadge status="STUDIED" percentage={100} />
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-gold-light');
    expect(badge).toHaveClass('dark:bg-gold-dark');
  });

  it('renders as circular badge', () => {
    const { container } = render(
      <ProgressBadge status="IN_PROGRESS" percentage={75} />
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('rounded-full');
  });

  it('has appropriate size for badge', () => {
    const { container } = render(
      <ProgressBadge status="IN_PROGRESS" percentage={50} />
    );
    const badge = container.firstChild as HTMLElement;
    // Should have fixed width/height for circular shape
    expect(badge).toHaveClass('w-12');
    expect(badge).toHaveClass('h-12');
  });

  it('centers text within badge', () => {
    const { container } = render(
      <ProgressBadge status="IN_PROGRESS" percentage={50} />
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('flex');
    expect(badge).toHaveClass('items-center');
    expect(badge).toHaveClass('justify-center');
  });

  it('uses appropriate font size for percentage text', () => {
    const { container } = render(
      <ProgressBadge status="IN_PROGRESS" percentage={50} />
    );
    const badge = container.firstChild as HTMLElement;
    // Body Small from ux-design.md (0.875rem / 14px)
    expect(badge).toHaveClass('text-sm');
  });

  it('has accessible role and label', () => {
    render(<ProgressBadge status="IN_PROGRESS" percentage={65} />);
    const badge = screen.getByLabelText('Progress: 65%');
    expect(badge).toBeInTheDocument();
  });

  it('handles edge case of 0 percentage', () => {
    render(<ProgressBadge status="NOT_STARTED" percentage={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles edge case of 100 percentage', () => {
    render(<ProgressBadge status="STUDIED" percentage={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('applies dark mode styling', () => {
    const { container } = render(
      <ProgressBadge status="IN_PROGRESS" percentage={50} />
    );
    const badge = container.firstChild as HTMLElement;
    // Should have dark mode variants
    expect(badge.className).toContain('dark:');
  });
});
