import { render, screen } from '@testing-library/react';
import { ParchmentCard } from './ParchmentCard';

describe('ParchmentCard', () => {
  it('renders without crashing', () => {
    render(<ParchmentCard>Test content</ParchmentCard>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies children prop correctly', () => {
    render(
      <ParchmentCard>
        <div data-testid="child-element">Child content</div>
      </ParchmentCard>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ParchmentCard className="custom-class">Content</ParchmentCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('applies default variant styling', () => {
    const { container } = render(<ParchmentCard>Content</ParchmentCard>);
    const card = container.firstChild as HTMLElement;
    // Should have parchment background color from ux-design.md
    expect(card).toHaveClass('bg-parchment-light');
    expect(card).toHaveClass('dark:bg-parchment-dark');
  });

  it('applies elevated variant styling', () => {
    const { container } = render(
      <ParchmentCard variant="elevated">Content</ParchmentCard>
    );
    const card = container.firstChild as HTMLElement;
    // Elevated variant should have increased shadow
    expect(card).toHaveClass('shadow-lg');
  });

  it('applies Roman theme design tokens', () => {
    const { container } = render(<ParchmentCard>Content</ParchmentCard>);
    const card = container.firstChild as HTMLElement;
    // Border radius should be 12px (slightly rounded, organic feel)
    expect(card).toHaveClass('rounded-xl');
    // Border from ux-design.md
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-border-medium');
  });

  it('has accessible structure', () => {
    render(
      <ParchmentCard>
        <h2>Card Title</h2>
        <p>Card content</p>
      </ParchmentCard>
    );
    // Should allow semantic HTML children
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });
});
