import { render, screen } from '@testing-library/react';
import { MessageBubble } from './MessageBubble';

describe('MessageBubble', () => {
  const mockTimestamp = new Date('2026-01-07T10:00:00Z');

  it('renders without crashing', () => {
    render(
      <MessageBubble
        role="user"
        content="Test message"
        timestamp={mockTimestamp}
      />
    );
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('applies user role styling correctly', () => {
    const { container } = render(
      <MessageBubble
        role="user"
        content="User message"
        timestamp={mockTimestamp}
      />
    );

    const bubble = container.firstChild as HTMLElement;
    // User messages should be right-aligned
    expect(bubble).toHaveClass('ml-auto');
    // User messages use Marble background
    expect(bubble).toHaveClass('bg-marble-light');
  });

  it('applies assistant role styling correctly', () => {
    const { container } = render(
      <MessageBubble
        role="assistant"
        content="Assistant message"
        timestamp={mockTimestamp}
      />
    );

    const bubble = container.firstChild as HTMLElement;
    // Assistant messages should be left-aligned
    expect(bubble).toHaveClass('mr-auto');
    // Assistant messages use Parchment background
    expect(bubble).toHaveClass('bg-parchment-light');
  });

  it('displays timestamp', () => {
    render(
      <MessageBubble
        role="user"
        content="Message"
        timestamp={mockTimestamp}
      />
    );

    // Should show formatted time
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
  });

  it('applies scroll-style curled edges design', () => {
    const { container } = render(
      <MessageBubble
        role="user"
        content="Message"
        timestamp={mockTimestamp}
      />
    );

    const bubble = container.firstChild as HTMLElement;
    // Should have rounded corners per ux-design.md
    expect(bubble).toHaveClass('rounded-2xl');
    // Should have border
    expect(bubble).toHaveClass('border');
  });

  it('has proper accessibility attributes', () => {
    render(
      <MessageBubble
        role="assistant"
        content="Hello"
        timestamp={mockTimestamp}
      />
    );

    const message = screen.getByRole('article');
    expect(message).toHaveAttribute('aria-label');
    expect(message.getAttribute('aria-label')).toContain('assistant');
  });

  it('applies max width per ux-design.md spec', () => {
    const { container } = render(
      <MessageBubble
        role="user"
        content="Message"
        timestamp={mockTimestamp}
      />
    );

    const bubble = container.firstChild as HTMLElement;
    // 70% max width per design spec
    expect(bubble).toHaveClass('max-w-[70%]');
  });

  it('has proper padding per ux-design.md', () => {
    const { container } = render(
      <MessageBubble
        role="user"
        content="Message"
        timestamp={mockTimestamp}
      />
    );

    const bubble = container.firstChild as HTMLElement;
    // md vertical, lg horizontal padding
    expect(bubble).toHaveClass('px-6'); // lg = 24px
    expect(bubble).toHaveClass('py-4'); // md = 16px
  });
});
