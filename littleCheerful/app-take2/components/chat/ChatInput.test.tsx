import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
  it('renders without crashing', () => {
    render(<ChatInput onSend={() => {}} disabled={false} />);
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
  });

  it('calls onSend with message text', async () => {
    const user = userEvent.setup();
    const mockSend = jest.fn();

    render(<ChatInput onSend={mockSend} disabled={false} />);

    const input = screen.getByPlaceholderText(/type your message/i);
    await user.type(input, 'Hello Claude');

    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);

    expect(mockSend).toHaveBeenCalledWith('Hello Claude');
  });

  it('sends message on Enter key press', async () => {
    const user = userEvent.setup();
    const mockSend = jest.fn();

    render(<ChatInput onSend={mockSend} disabled={false} />);

    const input = screen.getByPlaceholderText(/type your message/i);
    await user.type(input, 'Test message{Enter}');

    expect(mockSend).toHaveBeenCalledWith('Test message');
  });

  it('clears input after sending', async () => {
    const user = userEvent.setup();
    const mockSend = jest.fn();

    render(<ChatInput onSend={mockSend} disabled={false} />);

    const input = screen.getByPlaceholderText(/type your message/i) as HTMLInputElement;
    await user.type(input, 'Test{Enter}');

    expect(input.value).toBe('');
  });

  it('is disabled when disabled prop is true', () => {
    render(<ChatInput onSend={() => {}} disabled={true} />);

    const input = screen.getByPlaceholderText(/type your message/i);
    const button = screen.getByRole('button', { name: /send/i });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('does not send empty messages', async () => {
    const user = userEvent.setup();
    const mockSend = jest.fn();

    render(<ChatInput onSend={mockSend} disabled={false} />);

    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);

    expect(mockSend).not.toHaveBeenCalled();
  });

  it('uses custom placeholder when provided', () => {
    render(
      <ChatInput
        onSend={() => {}}
        disabled={false}
        placeholder="Ask a question..."
      />
    );

    expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
  });

  it('has proper form semantics', () => {
    render(<ChatInput onSend={() => {}} disabled={false} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('has accessible button label', () => {
    render(<ChatInput onSend={() => {}} disabled={false} />);

    const button = screen.getByRole('button', { name: /send/i });
    expect(button).toHaveAccessibleName();
  });

  it('does not send on Shift+Enter', async () => {
    const user = userEvent.setup();
    const mockSend = jest.fn();

    render(<ChatInput onSend={mockSend} disabled={false} />);

    const input = screen.getByPlaceholderText(/type your message/i);
    await user.type(input, 'Line 1{Shift>}{Enter}{/Shift}Line 2');

    expect(mockSend).not.toHaveBeenCalled();
  });
});
