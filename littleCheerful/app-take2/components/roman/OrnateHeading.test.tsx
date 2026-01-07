import { render, screen } from '@testing-library/react';
import { OrnateHeading } from './OrnateHeading';

describe('OrnateHeading', () => {
  it('renders without crashing', () => {
    render(<OrnateHeading level={1}>Test Heading</OrnateHeading>);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('renders h1 when level is 1', () => {
    render(<OrnateHeading level={1}>Heading 1</OrnateHeading>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders h2 when level is 2', () => {
    render(<OrnateHeading level={2}>Heading 2</OrnateHeading>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders h3 when level is 3', () => {
    render(<OrnateHeading level={3}>Heading 3</OrnateHeading>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('applies EB Garamond font from design system', () => {
    const { container } = render(<OrnateHeading level={1}>Heading</OrnateHeading>);
    const heading = container.firstChild as HTMLElement;
    expect(heading).toHaveClass('font-display'); // EB Garamond
  });

  it('applies gold underline decoration', () => {
    const { container } = render(<OrnateHeading level={1}>Heading</OrnateHeading>);
    const heading = container.firstChild as HTMLElement;
    // Should have decorative underline
    expect(heading).toHaveClass('border-b');
    expect(heading).toHaveClass('border-gold-light');
    expect(heading).toHaveClass('dark:border-gold-dark');
  });

  it('applies custom className', () => {
    const { container } = render(
      <OrnateHeading level={2} className="custom-heading">Heading</OrnateHeading>
    );
    const heading = container.firstChild as HTMLElement;
    expect(heading).toHaveClass('custom-heading');
  });

  it('applies correct text size for level 1', () => {
    const { container } = render(<OrnateHeading level={1}>H1</OrnateHeading>);
    const heading = container.firstChild as HTMLElement;
    expect(heading).toHaveClass('text-4xl'); // 2rem = 32px
  });

  it('applies correct text size for level 2', () => {
    const { container } = render(<OrnateHeading level={2}>H2</OrnateHeading>);
    const heading = container.firstChild as HTMLElement;
    expect(heading).toHaveClass('text-3xl'); // 1.5rem = 24px
  });
});
