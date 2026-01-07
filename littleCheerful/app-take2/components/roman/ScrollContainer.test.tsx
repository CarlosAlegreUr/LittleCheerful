import { render, screen } from '@testing-library/react';
import { ScrollContainer } from './ScrollContainer';

describe('ScrollContainer', () => {
  it('renders without crashing', () => {
    render(<ScrollContainer>Scrollable content</ScrollContainer>);
    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  it('applies children prop correctly', () => {
    render(
      <ScrollContainer>
        <div data-testid="scroll-child">Long content</div>
      </ScrollContainer>
    );
    expect(screen.getByTestId('scroll-child')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ScrollContainer className="custom-scroll">Content</ScrollContainer>
    );
    // ScrollContainer wraps content, check for className on wrapper
    expect(container.querySelector('.custom-scroll')).toBeInTheDocument();
  });

  it('applies custom height prop', () => {
    const { container } = render(
      <ScrollContainer height="400px">Content</ScrollContainer>
    );
    const scrollArea = container.querySelector('[data-scroll-container]');
    expect(scrollArea).toHaveStyle({ height: '400px' });
  });

  it('extends shadcn ScrollArea with Roman styling', () => {
    const { container } = render(<ScrollContainer>Content</ScrollContainer>);
    // Should use ScrollArea as base
    const scrollArea = container.querySelector('[data-radix-scroll-area-viewport]');
    expect(scrollArea).toBeInTheDocument();
  });
});
