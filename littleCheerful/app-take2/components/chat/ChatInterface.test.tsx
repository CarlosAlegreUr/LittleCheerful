import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInterface } from './ChatInterface';

describe('ChatInterface', () => {
  const mockMessages = [
    { id: '1', role: 'user' as const, content: 'Hello', timestamp: new Date() },
    { id: '2', role: 'assistant' as const, content: 'Hi there!', timestamp: new Date() },
  ];

  it('renders without crashing', () => {
    render(
      <ChatInterface
        messages={[]}
        onSendMessage={() => {}}
        isStreaming={false}
      />
    );
    expect(screen.getByRole('region', { name: /chat/i })).toBeInTheDocument();
  });

  it('displays message list correctly', () => {
    render(
      <ChatInterface
        messages={mockMessages}
        onSendMessage={() => {}}
        isStreaming={false}
      />
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('renders chat input at bottom', () => {
    const { container } = render(
      <ChatInterface
        messages={[]}
        onSendMessage={() => {}}
        isStreaming={false}
      />
    );
    const chatInput = container.querySelector('[data-testid="chat-input"]');
    expect(chatInput).toBeInTheDocument();
  });

  it('calls onSendMessage when message sent', async () => {
    const user = userEvent.setup();
    const mockSend = jest.fn();

    render(
      <ChatInterface
        messages={[]}
        onSendMessage={mockSend}
        isStreaming={false}
      />
    );

    const input = screen.getByPlaceholderText(/type your message/i);
    await user.type(input, 'Test message');

    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);

    expect(mockSend).toHaveBeenCalledWith('Test message');
  });

  it('disables input when streaming', () => {
    render(
      <ChatInterface
        messages={mockMessages}
        onSendMessage={() => {}}
        isStreaming={true}
      />
    );

    const input = screen.getByPlaceholderText(/type your message/i);
    expect(input).toBeDisabled();
  });

  it('shows three-option prompt when provided', () => {
    render(
      <ChatInterface
        messages={mockMessages}
        onSendMessage={() => {}}
        isStreaming={false}
        threeOptionState={{ show: true, onOptionSelect: () => {} }}
      />
    );

    expect(screen.getByText(/think more/i)).toBeInTheDocument();
  });

  it('uses ParchmentCard and ScrollContainer from roman components', () => {
    const { container } = render(
      <ChatInterface
        messages={mockMessages}
        onSendMessage={() => {}}
        isStreaming={false}
      />
    );

    // Should have parchment styling
    expect(container.querySelector('.bg-parchment-light')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ChatInterface
        messages={mockMessages}
        onSendMessage={() => {}}
        isStreaming={false}
      />
    );

    expect(screen.getByRole('region', { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByRole('log')).toBeInTheDocument(); // Message list
  });
});
