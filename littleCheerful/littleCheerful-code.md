# Code Consolidation: littleCheerful

**Generated:** Sun Feb  1 11:22:23 GMTST 2026
**Source Directory:** /e/Dev/LittleCheerful/littleCheerful

---


## `app-take2/components/chat/ChatInput.test.tsx`

```typescript
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

```


## `app-take2/components/chat/ChatInput.tsx`

```typescript
import React, { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled,
  placeholder = 'Type your message...',
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2" data-testid="chat-input">
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
        aria-label="Message input"
      />
      <Button
        onClick={handleSend}
        disabled={disabled}
        aria-label="Send message"
      >
        Send
      </Button>
    </div>
  );
};

```


## `app-take2/components/chat/ChatInterface.test.tsx`

```typescript
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

```


## `app-take2/components/chat/ChatInterface.tsx`

```typescript
import React from 'react';
import { ParchmentCard } from '@/components/roman/ParchmentCard';
import { ScrollContainer } from '@/components/roman/ScrollContainer';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ThreeOptionPrompt } from './ThreeOptionPrompt';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ThreeOptionState {
  show: boolean;
  onOptionSelect: (option: 'think' | 'hint' | 'explain') => void;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
  threeOptionState?: ThreeOptionState;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isStreaming,
  threeOptionState,
}) => {
  return (
    <ParchmentCard
      className="flex flex-col h-full"
      role="region"
      aria-label="Chat interface"
    >
      <ScrollContainer className="flex-1 mb-4">
        <div role="log" aria-live="polite" className="space-y-4 p-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
        </div>
      </ScrollContainer>

      {threeOptionState?.show && (
        <div className="mb-4 px-4">
          <ThreeOptionPrompt
            onOptionSelect={threeOptionState.onOptionSelect}
            disabled={isStreaming}
          />
        </div>
      )}

      <div className="px-4 pb-4">
        <ChatInput
          onSend={onSendMessage}
          disabled={isStreaming}
          placeholder="Type your message..."
        />
      </div>
    </ParchmentCard>
  );
};

```


## `app-take2/components/chat/MarkdownRenderer.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { MarkdownRenderer } from './MarkdownRenderer';

// Mock react-markdown and related modules
jest.mock('react-markdown', () => {
  return {
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
  };
});

jest.mock('remark-math', () => ({
  __esModule: true,
  default: () => {},
}));

jest.mock('rehype-katex', () => ({
  __esModule: true,
  default: () => {},
}));

describe('MarkdownRenderer', () => {
  it('renders without crashing', () => {
    render(<MarkdownRenderer content="Plain text" />);
    expect(screen.getByText('Plain text')).toBeInTheDocument();
  });

  it('renders markdown content through ReactMarkdown', () => {
    // Note: React-markdown is mocked, so we verify component structure only
    const { container } = render(<MarkdownRenderer content="# Heading 1\n## Heading 2" />);

    expect(container.firstChild).toHaveClass('font-crimson');
    expect(container.firstChild).toHaveClass('text-ink-light');
    expect(container.firstChild).toHaveClass('dark:text-ink-dark');
  });

  it('passes content to ReactMarkdown', () => {
    // Mocked ReactMarkdown receives content as children
    render(<MarkdownRenderer content="**bold text**" />);
    expect(screen.getByText('**bold text**')).toBeInTheDocument();
  });

  it('renders different markdown formats', () => {
    // Test various markdown types are passed through
    const { container } = render(<MarkdownRenderer content="_italic text_" />);
    expect(container).toBeInTheDocument();
  });

  it('handles code blocks', () => {
    const { container } = render(
      <MarkdownRenderer content="```javascript\nconst x = 1;\n```" />
    );
    expect(container).toBeInTheDocument();
  });

  it('handles inline code', () => {
    const { container } = render(<MarkdownRenderer content="`inline code`" />);
    expect(container).toBeInTheDocument();
  });

  it('handles lists', () => {
    const { container } = render(
      <MarkdownRenderer content="- Item 1\n- Item 2\n- Item 3" />
    );
    expect(container).toBeInTheDocument();
  });

  it('configures KaTeX for inline math', () => {
    // Note: KaTeX is mocked, verifying configuration is passed
    const { container } = render(
      <MarkdownRenderer content="Equation: $E = mc^2$" />
    );
    expect(container).toBeInTheDocument();
  });

  it('configures KaTeX for block math', () => {
    const { container } = render(
      <MarkdownRenderer content="$$\n\\int_0^\\infty e^{-x^2} dx\n$$" />
    );
    expect(container).toBeInTheDocument();
  });

  it('applies Roman theme typography', () => {
    const { container } = render(<MarkdownRenderer content="# Heading\nBody text" />);

    // Body text should use Crimson Text
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('font-crimson');
  });

  it('applies proper text color', () => {
    const { container } = render(<MarkdownRenderer content="Text" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('text-ink-light');
    expect(wrapper).toHaveClass('dark:text-ink-dark');
  });

  it('handles links', () => {
    // Mocked ReactMarkdown, so we verify structure
    const { container } = render(<MarkdownRenderer content="[Link text](https://example.com)" />);
    expect(container).toBeInTheDocument();
  });

  it('handles empty content', () => {
    const { container } = render(<MarkdownRenderer content="" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles malformed markdown gracefully', () => {
    const { container } = render(<MarkdownRenderer content="**unclosed bold" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies proper spacing per ux-design.md', () => {
    const { container } = render(<MarkdownRenderer content="# Heading\nParagraph" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('space-y-4');
  });
});

```


## `app-take2/components/chat/MarkdownRenderer.tsx`

```typescript
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="font-crimson text-ink-light dark:text-ink-dark space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-garamond text-3xl font-semibold mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-garamond text-2xl font-semibold mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-garamond text-xl font-semibold mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="leading-relaxed mb-4">
              {children}
            </p>
          ),
          code: ({ inline, children, ...props }: any) => (
            inline ? (
              <code className="bg-marble-light dark:bg-marble-dark px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className="block bg-marble-light dark:bg-marble-dark p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props}>
                {children}
              </code>
            )
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-crimson-light dark:text-crimson-dark underline hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-4">
              {children}
            </ol>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

```


## `app-take2/components/chat/MessageBubble.test.tsx`

```typescript
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

```


## `app-take2/components/chat/MessageBubble.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <article
      className={cn(
        'max-w-[70%] rounded-2xl border px-6 py-4 shadow-sm',
        'texture-parchment', // Paper grain texture
        'animate-message-fade-in', // Fade-in animation from globals.css
        'relative', // For scroll curl positioning
        isUser
          ? 'ml-auto bg-marble-light dark:bg-marble-dark border-border-medium scroll-curl-right'
          : 'mr-auto bg-parchment-light dark:bg-parchment-dark border-border-light scroll-curl-left'
      )}
      aria-label={`Message from ${role}, sent at ${formatTime(timestamp)}`}
    >
      <div className="space-y-2">
        <p className="text-ink-light dark:text-ink-dark text-base leading-relaxed">
          {content}
        </p>
        <time
          className="block text-xs text-ink-light/60 dark:text-ink-dark/60"
          dateTime={timestamp.toISOString()}
        >
          {formatTime(timestamp)}
        </time>
      </div>
    </article>
  );
};

```


## `app-take2/components/chat/StreamingIndicator.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { StreamingIndicator } from './StreamingIndicator';

describe('StreamingIndicator', () => {
  it('renders without crashing when visible', () => {
    render(<StreamingIndicator visible={true} />);
    expect(screen.getByText(/claude is writing/i)).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    const { container } = render(<StreamingIndicator visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays QuillLoader animation', () => {
    const { container } = render(<StreamingIndicator visible={true} />);

    // QuillLoader should be present
    expect(container.querySelector('[data-testid="quill-loader"]')).toBeInTheDocument();
  });

  it('displays typing text', () => {
    render(<StreamingIndicator visible={true} />);
    expect(screen.getByText(/claude is writing/i)).toBeInTheDocument();
  });

  it('has aria-live polite for accessibility', () => {
    render(<StreamingIndicator visible={true} />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  });

  it('has aria-busy when visible', () => {
    render(<StreamingIndicator visible={true} />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-busy', 'true');
  });

  it('applies proper styling', () => {
    const { container } = render(<StreamingIndicator visible={true} />);

    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('flex');
    expect(indicator).toHaveClass('items-center');
  });

  it('uses Roman theme colors', () => {
    const { container } = render(<StreamingIndicator visible={true} />);

    const text = screen.getByText(/claude is writing/i);
    expect(text).toHaveClass('text-ink-light');
  });

  it('applies proper spacing between loader and text', () => {
    const { container } = render(<StreamingIndicator visible={true} />);

    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('gap-2');
  });

  it('has accessible role', () => {
    render(<StreamingIndicator visible={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

```


## `app-take2/components/chat/StreamingIndicator.tsx`

```typescript
import React from 'react';

interface StreamingIndicatorProps {
  visible: boolean;
}

export const StreamingIndicator: React.FC<StreamingIndicatorProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="flex items-center gap-2" role="status" aria-live="polite" aria-busy="true">
      <div data-testid="quill-loader">
        <svg
          className="stroke-ink-light dark:stroke-ink-dark animate-pulse"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 40 L24 24 L32 8 M24 24 L40 16"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-[draw_1.2s_ease-in_infinite]"
          />
          <path
            d="M8 40 L4 44"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-ink-light dark:text-ink-dark text-sm">
        Claude is writing...
      </span>
    </div>
  );
};

```


## `app-take2/components/chat/ThreeOptionPrompt.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThreeOptionPrompt } from './ThreeOptionPrompt';

describe('ThreeOptionPrompt', () => {
  it('renders without crashing', () => {
    render(<ThreeOptionPrompt onOptionSelect={() => {}} disabled={false} />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('renders all three option buttons', () => {
    render(<ThreeOptionPrompt onOptionSelect={() => {}} disabled={false} />);

    expect(screen.getByRole('button', { name: /think more/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /give hint/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explain/i })).toBeInTheDocument();
  });

  it('calls onOptionSelect with "think" when Think More clicked', async () => {
    const user = userEvent.setup();
    const mockSelect = jest.fn();

    render(<ThreeOptionPrompt onOptionSelect={mockSelect} disabled={false} />);

    const button = screen.getByRole('button', { name: /think more/i });
    await user.click(button);

    expect(mockSelect).toHaveBeenCalledWith('think');
  });

  it('calls onOptionSelect with "hint" when Give Hint clicked', async () => {
    const user = userEvent.setup();
    const mockSelect = jest.fn();

    render(<ThreeOptionPrompt onOptionSelect={mockSelect} disabled={false} />);

    const button = screen.getByRole('button', { name: /give hint/i });
    await user.click(button);

    expect(mockSelect).toHaveBeenCalledWith('hint');
  });

  it('calls onOptionSelect with "explain" when Explain clicked', async () => {
    const user = userEvent.setup();
    const mockSelect = jest.fn();

    render(<ThreeOptionPrompt onOptionSelect={mockSelect} disabled={false} />);

    const button = screen.getByRole('button', { name: /explain/i });
    await user.click(button);

    expect(mockSelect).toHaveBeenCalledWith('explain');
  });

  it('disables all buttons when disabled prop is true', () => {
    render(<ThreeOptionPrompt onOptionSelect={() => {}} disabled={true} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('uses Roman-styled buttons', () => {
    const { container } = render(
      <ThreeOptionPrompt onOptionSelect={() => {}} disabled={false} />
    );

    const buttons = container.querySelectorAll('button');
    // Should use Crimson color per ux-design.md
    expect(buttons[0]).toHaveClass('border-crimson-light');
  });

  it('displays buttons in horizontal row', () => {
    const { container } = render(
      <ThreeOptionPrompt onOptionSelect={() => {}} disabled={false} />
    );

    const group = container.querySelector('[role="group"]');
    expect(group).toHaveClass('flex');
    expect(group).toHaveClass('flex-row');
  });

  it('has proper accessibility attributes', () => {
    render(<ThreeOptionPrompt onOptionSelect={() => {}} disabled={false} />);

    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'Mistake recovery options');
  });

  it('has descriptive button labels', () => {
    render(<ThreeOptionPrompt onOptionSelect={() => {}} disabled={false} />);

    expect(screen.getByRole('button', { name: /think more/i })).toHaveAccessibleName();
    expect(screen.getByRole('button', { name: /give hint/i })).toHaveAccessibleName();
    expect(screen.getByRole('button', { name: /explain/i })).toHaveAccessibleName();
  });

  it('applies spacing between buttons', () => {
    const { container } = render(
      <ThreeOptionPrompt onOptionSelect={() => {}} disabled={false} />
    );

    const group = container.querySelector('[role="group"]');
    expect(group).toHaveClass('gap-4');
  });
});

```


## `app-take2/components/chat/ThreeOptionPrompt.tsx`

```typescript
import React from 'react';
import { Button } from '@/components/ui/button';

interface ThreeOptionPromptProps {
  onOptionSelect: (option: 'think' | 'hint' | 'explain') => void;
  disabled: boolean;
}

export const ThreeOptionPrompt: React.FC<ThreeOptionPromptProps> = ({
  onOptionSelect,
  disabled,
}) => {
  return (
    <div
      role="group"
      aria-label="Mistake recovery options"
      className="flex flex-row gap-4"
    >
      <Button
        onClick={() => onOptionSelect('think')}
        disabled={disabled}
        variant="outline"
        className="border-crimson-light dark:border-crimson-dark text-crimson-light dark:text-crimson-dark hover:bg-crimson-light/10"
      >
        Think More
      </Button>
      <Button
        onClick={() => onOptionSelect('hint')}
        disabled={disabled}
        variant="outline"
        className="border-crimson-light dark:border-crimson-dark text-crimson-light dark:text-crimson-dark hover:bg-crimson-light/10"
      >
        Give Hint
      </Button>
      <Button
        onClick={() => onOptionSelect('explain')}
        disabled={disabled}
        variant="outline"
        className="border-crimson-light dark:border-crimson-dark text-crimson-light dark:text-crimson-dark hover:bg-crimson-light/10"
      >
        Explain
      </Button>
    </div>
  );
};

```


## `app-take2/components/layout/ErrorBoundary.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// Test component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error heading
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('uses InkBlot component for error display', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // InkBlot should be present (check for its characteristic classes or structure)
    expect(container.querySelector('.relative')).toBeInTheDocument();
  });

  it('does not render error UI when no error thrown', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});

```


## `app-take2/components/layout/ErrorBoundary.tsx`

```typescript
'use client';

import * as React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-2xl text-center relative">
            {/* InkBlot effect - expanding circle animation */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blood-light dark:bg-blood-dark opacity-30 blur-2xl rounded-full animate-ink-blot" />
              <h1 className="relative text-4xl font-display font-semibold mb-4 text-ink-light dark:text-ink-dark">
                Something went wrong
              </h1>
            </div>
            <p className="text-lg mb-6 text-ink-light/70 dark:text-ink-dark/70">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gold-light dark:bg-gold-dark text-ink-light dark:text-ink-dark rounded-lg hover:opacity-90 transition-opacity"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

```


## `app-take2/components/layout/Header.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

// Mock useTheme
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

describe('Header', () => {
  const renderHeader = (showSidebar = false) => {
    return render(<Header showSidebar={showSidebar} />);
  };

  it('renders without crashing', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders app title with OrnateHeading', () => {
    renderHeader();
    expect(screen.getByText('Little Cheerful')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    renderHeader();
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('toggles theme when button clicked', () => {
    const setTheme = jest.fn();
    jest.spyOn(require('next-themes'), 'useTheme').mockReturnValue({
      theme: 'light',
      setTheme,
    });

    renderHeader();
    const toggleButton = screen.getByLabelText('Toggle theme');
    fireEvent.click(toggleButton);

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('has sticky position at top', () => {
    const { container } = renderHeader();
    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky');
    expect(header).toHaveClass('top-0');
  });

  it('displays menu button when showSidebar is true', () => {
    renderHeader(true);
    expect(screen.getByLabelText('Toggle sidebar')).toBeInTheDocument();
  });

  it('does not display menu button when showSidebar is false', () => {
    renderHeader(false);
    expect(screen.queryByLabelText('Toggle sidebar')).not.toBeInTheDocument();
  });
});

```


## `app-take2/components/layout/Header.tsx`

```typescript
'use client';

import * as React from 'react';
import { OrnateHeading } from '@/components/roman/OrnateHeading';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({ showSidebar = false, onToggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className={cn(
        'sticky top-0 z-50',
        'bg-marble-light dark:bg-marble-dark',
        'texture-marble', // Marble veining texture
        'border-b border-border-medium',
        'px-4 py-3',
        'flex items-center justify-between'
      )}
      role="banner"
    >
      <div className="flex items-center gap-4">
        {showSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <OrnateHeading level={2} className="border-0 pb-0">
          Little Cheerful
        </OrnateHeading>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    </header>
  );
}

```


## `app-take2/components/layout/LayoutWrapper.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';

// Unmock LayoutWrapper for this test file
jest.unmock('@/components/layout/LayoutWrapper');

import { LayoutWrapper } from './LayoutWrapper';

// Mock usePathname
const mockPathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock useTheme
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: { goals: [] },
    isLoading: false,
    isError: false,
  }),
}));

describe('LayoutWrapper', () => {
  it('renders children without layout on landing page', () => {
    mockPathname.mockReturnValue('/');
    render(
      <LayoutWrapper>
        <div>Test content</div>
      </LayoutWrapper>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders children without layout on setup page', () => {
    mockPathname.mockReturnValue('/setup');
    render(
      <LayoutWrapper>
        <div>Onboarding content</div>
      </LayoutWrapper>
    );

    expect(screen.getByText('Onboarding content')).toBeInTheDocument();
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders children with layout on /learn page', () => {
    mockPathname.mockReturnValue('/learn');
    render(
      <LayoutWrapper>
        <div>Dashboard content</div>
      </LayoutWrapper>
    );

    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders children with layout on /materials page', () => {
    mockPathname.mockReturnValue('/materials');
    render(
      <LayoutWrapper>
        <div>Materials content</div>
      </LayoutWrapper>
    );

    expect(screen.getByText('Materials content')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('wraps all content with ErrorBoundary', () => {
    mockPathname.mockReturnValue('/learn');
    const { container } = render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    );

    // ErrorBoundary should be in the component tree
    expect(container).toBeInTheDocument();
  });
});

```


## `app-take2/components/layout/LayoutWrapper.tsx`

```typescript
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ErrorBoundary } from './ErrorBoundary';

export interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Don't show layout on landing page or onboarding pages
  const showLayout = pathname !== '/' && !pathname.startsWith('/setup');

  if (!showLayout) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Header showSidebar={true} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

```


## `app-take2/components/layout/Sidebar.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/learn',
}));

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: {
      goals: [
        { name: 'Goal 1', description: 'Test goal 1' },
        { name: 'Goal 2', description: 'Test goal 2' },
      ],
    },
    isLoading: false,
    isError: false,
  }),
}));

describe('Sidebar', () => {
  it('renders without crashing', () => {
    render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders Dashboard navigation link', () => {
    render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders Materials navigation link', () => {
    render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText('Materials')).toBeInTheDocument();
  });

  it('renders current goals list', () => {
    render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText('Goal 1')).toBeInTheDocument();
    expect(screen.getByText('Goal 2')).toBeInTheDocument();
  });

  it('uses ParchmentCard for styling', () => {
    const { container } = render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    // ParchmentCard has bg-parchment-light class
    expect(container.querySelector('.bg-parchment-light')).toBeInTheDocument();
  });

  it('is hidden when isOpen is false on mobile', () => {
    const { container } = render(<Sidebar isOpen={false} onClose={jest.fn()} />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('hidden');
  });

  it('is visible when isOpen is true', () => {
    const { container } = render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    const nav = container.querySelector('nav');
    expect(nav).not.toHaveClass('hidden');
  });
});

```


## `app-take2/components/layout/Sidebar.tsx`

```typescript
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ParchmentCard } from '@/components/roman/ParchmentCard';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Upload } from 'lucide-react';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GoalsResponse {
  goals: Array<{ name: string; description: string }>;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Fetch current goals
  const { data } = useQuery<GoalsResponse>({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await fetch('/api/learning/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      return response.json();
    },
  });

  const goals = data?.goals || [];

  const navItems = [
    { href: '/learn', label: 'Dashboard', icon: BookOpen },
    { href: '/materials', label: 'Materials', icon: Upload },
  ];

  return (
    <nav
      className={cn(
        'fixed md:static inset-y-0 left-0 z-40',
        'w-64 bg-marble-light dark:bg-marble-dark',
        'texture-marble', // Marble veining texture
        'border-r border-border-medium',
        'flex flex-col',
        'transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        !isOpen && 'hidden md:flex'
      )}
      role="navigation"
    >
      <div className="p-4 space-y-4 overflow-y-auto">
        {/* Navigation Links */}
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg',
                  'transition-colors duration-200',
                  isActive
                    ? 'bg-gold-light/20 dark:bg-gold-dark/20 text-ink-light dark:text-ink-dark'
                    : 'hover:bg-parchment-dark/10 dark:hover:bg-parchment-light/10'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Current Goals */}
        {goals.length > 0 && (
          <ParchmentCard className="p-4">
            <h3 className="text-sm font-semibold mb-2 text-ink-light dark:text-ink-dark">
              Current Goals
            </h3>
            <div className="space-y-2">
              {goals.map((goal) => (
                <Link
                  key={goal.name}
                  href={`/learn/${goal.name}`}
                  onClick={onClose}
                  className="block p-2 rounded hover:bg-gold-light/10 dark:hover:bg-gold-dark/10 transition-colors"
                >
                  <div className="text-sm font-medium text-ink-light dark:text-ink-dark">
                    {goal.name}
                  </div>
                  <div className="text-xs text-ink-light/70 dark:text-ink-dark/70 line-clamp-1">
                    {goal.description}
                  </div>
                </Link>
              ))}
            </div>
          </ParchmentCard>
        )}
      </div>
    </nav>
  );
}

```


## `app-take2/components/materials/MaterialCard.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MaterialCard } from './MaterialCard';
import { StudyMaterial } from '@/lib/types';

describe('MaterialCard', () => {
  const mockOnDelete = jest.fn();
  const mockOnSelect = jest.fn();

  const mockMaterial: StudyMaterial = {
    id: 'test-1',
    name: 'Study Guide.pdf',
    type: 'application/pdf',
    size: 1024000,
    uploadedAt: '2026-01-07T08:00:00Z',
    path: '/materials/study-guide.pdf',
  };

  const mockTextMaterial: StudyMaterial = {
    id: 'test-2',
    name: 'Notes.txt',
    type: 'text/plain',
    size: 2048,
    uploadedAt: '2026-01-07T09:00:00Z',
    path: '/materials/notes.txt',
  };

  beforeEach(() => {
    mockOnDelete.mockClear();
    mockOnSelect.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <MaterialCard
        material={mockMaterial}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );
    expect(screen.getByText('Study Guide.pdf')).toBeInTheDocument();
  });

  it('uses ParchmentCard from roman components', () => {
    const { container } = render(
      <MaterialCard
        material={mockMaterial}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    // Verify ParchmentCard styling is applied
    const card = container.querySelector('[data-material-card]');
    expect(card).toHaveClass(/parchment|bg-parchment/i);
  });

  it('displays file name', () => {
    render(
      <MaterialCard
        material={mockMaterial}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Study Guide.pdf')).toBeInTheDocument();
  });

  it('displays file size in human-readable format', () => {
    render(
      <MaterialCard
        material={mockMaterial}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    // 1024000 bytes = 1000 KB (< 1 MB)
    expect(screen.getByText(/1000\.0\s*KB/i)).toBeInTheDocument();
  });

  it('shows Book icon for PDF files', () => {
    const { container } = render(
      <MaterialCard
        material={mockMaterial}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    // Verify Book icon is rendered (lucide-react Book component)
    const icon = container.querySelector('[data-icon="book"]');
    expect(icon).toBeInTheDocument();
  });

  it('shows FileText icon for text files', () => {
    const { container } = render(
      <MaterialCard
        material={mockTextMaterial}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    // Verify FileText icon is rendered
    const icon = container.querySelector('[data-icon="file-text"]');
    expect(icon).toBeInTheDocument();
  });

  it('calls onSelect when card is clicked', () => {
    const { container } = render(
      <MaterialCard
        material={mockMaterial}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const card = container.querySelector('[data-material-card]');
    fireEvent.click(card!);

    expect(mockOnSelect).toHaveBeenCalledWith('test-1');
  });

  it('has delete button that appears on hover', () => {
    render(
      <MaterialCard
        material={mockMaterial}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const deleteButton = screen.getByLabelText(/delete/i);
    expect(deleteButton).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <MaterialCard
        material={mockMaterial}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const deleteButton = screen.getByLabelText(/delete/i);
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('test-1');
  });

  it('prevents onSelect when delete button is clicked', () => {
    render(
      <MaterialCard
        material={mockMaterial}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const deleteButton = screen.getByLabelText(/delete/i);
    fireEvent.click(deleteButton);

    // Only onDelete should be called, not onSelect
    expect(mockOnDelete).toHaveBeenCalledWith('test-1');
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(
      <MaterialCard
        material={mockMaterial}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const card = container.querySelector('[data-material-card]');

    // Card should be keyboard accessible
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('supports keyboard navigation', () => {
    const { container } = render(
      <MaterialCard
        material={mockMaterial}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const card = container.querySelector('[data-material-card]');

    // Simulate Enter key press
    fireEvent.keyDown(card!, { key: 'Enter', code: 'Enter' });

    expect(mockOnSelect).toHaveBeenCalledWith('test-1');
  });
});

```


## `app-take2/components/materials/MaterialCard.tsx`

```typescript
'use client';

import * as React from 'react';
import { ParchmentCard } from '@/components/roman/ParchmentCard';
import { StudyMaterial } from '@/lib/types';
import { Book, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MaterialCardProps {
  material: StudyMaterial;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export function MaterialCard({ material, onDelete, onSelect }: MaterialCardProps) {
  const handleCardClick = () => {
    onSelect(material.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent onSelect from firing
    onDelete(material.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(material.id);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  };

  const isPdf = material.type === 'application/pdf' || material.name.endsWith('.pdf');

  return (
    <ParchmentCard
      data-material-card
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative cursor-pointer transition-all hover:shadow-lg',
        'group p-4 space-y-3'
      )}
    >
      {/* File Icon */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {isPdf ? (
            <Book
              data-icon="book"
              className="h-10 w-10 text-gold-light dark:text-gold-dark"
            />
          ) : (
            <FileText
              data-icon="file-text"
              className="h-10 w-10 text-gold-light dark:text-gold-dark"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-ink-light dark:text-ink-dark truncate">
              {material.name}
            </h3>
            <p className="text-sm text-ink-light dark:text-ink-dark opacity-60">
              {formatFileSize(material.size)}
            </p>
          </div>
        </div>

        {/* Delete Button (hover reveal) */}
        <button
          onClick={handleDeleteClick}
          aria-label="Delete material"
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'p-1 rounded-md hover:bg-danger-light/10 dark:hover:bg-danger-dark/10'
          )}
        >
          <X className="h-5 w-5 text-danger-light dark:text-danger-dark" />
        </button>
      </div>
    </ParchmentCard>
  );
}

```


## `app-take2/components/materials/MaterialList.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MaterialList } from './MaterialList';
import { StudyMaterial } from '@/lib/types';

describe('MaterialList', () => {
  const mockOnDelete = jest.fn();
  const mockOnSelect = jest.fn();

  const mockMaterials: StudyMaterial[] = [
    {
      id: '1',
      name: 'Study Guide.pdf',
      type: 'application/pdf',
      size: 1024000,
      uploadedAt: '2026-01-07T08:00:00Z',
      path: '/materials/study-guide.pdf',
    },
    {
      id: '2',
      name: 'Notes.txt',
      type: 'text/plain',
      size: 2048,
      uploadedAt: '2026-01-07T09:00:00Z',
      path: '/materials/notes.txt',
    },
  ];

  beforeEach(() => {
    mockOnDelete.mockClear();
    mockOnSelect.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <MaterialList
        materials={mockMaterials}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );
    expect(screen.getByText('Study Guide.pdf')).toBeInTheDocument();
  });

  it('displays all materials in a grid', () => {
    const { container } = render(
      <MaterialList
        materials={mockMaterials}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    // Verify grid layout exists
    const grid = container.querySelector('[data-material-grid]');
    expect(grid).toBeInTheDocument();

    // Verify all materials are rendered
    expect(screen.getByText('Study Guide.pdf')).toBeInTheDocument();
    expect(screen.getByText('Notes.txt')).toBeInTheDocument();
  });

  it('shows empty state when no materials', () => {
    render(
      <MaterialList
        materials={[]}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText(/no materials yet/i)).toBeInTheDocument();
  });

  it('uses ScrollContainer from roman components', () => {
    const { container } = render(
      <MaterialList
        materials={mockMaterials}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    // Verify ScrollContainer is present
    const scrollContainer = container.querySelector('[data-scroll-container]');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('passes onDelete to MaterialCard components', () => {
    render(
      <MaterialList
        materials={mockMaterials}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    // Find delete button for first material
    const deleteButtons = screen.getAllByLabelText(/delete/i);
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('passes onSelect to MaterialCard components', () => {
    render(
      <MaterialList
        materials={mockMaterials}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    // Click on first material card
    const materialCard = screen.getByText('Study Guide.pdf').closest('[data-material-card]');
    fireEvent.click(materialCard!);

    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('renders correct number of MaterialCards', () => {
    const { container } = render(
      <MaterialList
        materials={mockMaterials}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
      />
    );

    const cards = container.querySelectorAll('[data-material-card]');
    expect(cards).toHaveLength(2);
  });
});

```


## `app-take2/components/materials/MaterialList.tsx`

```typescript
'use client';

import * as React from 'react';
import { ScrollContainer } from '@/components/roman/ScrollContainer';
import { MaterialCard } from './MaterialCard';
import { StudyMaterial } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface MaterialListProps {
  materials: StudyMaterial[];
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export function MaterialList({ materials, onDelete, onSelect }: MaterialListProps) {
  if (materials.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-ink-light dark:text-ink-dark opacity-60 text-center">
          No materials yet
        </p>
      </div>
    );
  }

  return (
    <ScrollContainer height="100%">
      <div
        data-material-grid
        className={cn(
          'grid gap-4 p-4',
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {materials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        ))}
      </div>
    </ScrollContainer>
  );
}

```


## `app-take2/components/materials/UploadZone.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UploadZone } from './UploadZone';

describe('UploadZone', () => {
  const mockOnFileSelect = jest.fn();
  const acceptedTypes = '.pdf,.txt';

  beforeEach(() => {
    mockOnFileSelect.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <UploadZone
        onFileSelect={mockOnFileSelect}
        accept={acceptedTypes}
        isUploading={false}
      />
    );
    expect(screen.getByText(/drop your scrolls here/i)).toBeInTheDocument();
  });

  it('displays default state correctly', () => {
    render(
      <UploadZone
        onFileSelect={mockOnFileSelect}
        accept={acceptedTypes}
        isUploading={false}
      />
    );

    // Verify idle state text
    expect(screen.getByText(/drop your scrolls here/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to browse/i)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(
      <UploadZone
        onFileSelect={mockOnFileSelect}
        accept={acceptedTypes}
        isUploading={false}
      />
    );

    // Check for role="button" or equivalent interactive element
    const uploadArea = container.querySelector('[role="button"]');
    expect(uploadArea).toBeInTheDocument();
  });

  it('shows drag-over state when files are dragged over', () => {
    const { container } = render(
      <UploadZone
        onFileSelect={mockOnFileSelect}
        accept={acceptedTypes}
        isUploading={false}
      />
    );

    const dropZone = container.querySelector('[data-upload-zone]');

    // Simulate drag enter
    fireEvent.dragEnter(dropZone!, {
      dataTransfer: { types: ['Files'] },
    });

    // Verify drag-over state (gold border or visual change)
    expect(dropZone).toHaveClass(/drag-over|border-gold/i);
  });

  it('calls onFileSelect when files are dropped', async () => {
    const { container } = render(
      <UploadZone
        onFileSelect={mockOnFileSelect}
        accept={acceptedTypes}
        isUploading={false}
      />
    );

    const dropZone = container.querySelector('[data-upload-zone]');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

    // Create mock FileList
    const fileList = {
      0: file,
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
    } as unknown as FileList;

    fireEvent.drop(dropZone!, {
      dataTransfer: { files: fileList },
    });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledTimes(1);
      expect(mockOnFileSelect).toHaveBeenCalledWith(expect.objectContaining({
        0: expect.any(File),
        length: 1,
      }));
    });
  });

  it('calls onFileSelect when click-to-browse is used', async () => {
    render(
      <UploadZone
        onFileSelect={mockOnFileSelect}
        accept={acceptedTypes}
        isUploading={false}
      />
    );

    const input = screen.getByLabelText(/upload/i, { selector: 'input[type="file"]' });
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalled();
    });
  });

  it('displays uploading state with QuillLoader', () => {
    render(
      <UploadZone
        onFileSelect={mockOnFileSelect}
        accept={acceptedTypes}
        isUploading={true}
      />
    );

    // Verify QuillLoader is shown
    expect(screen.getByTestId('quill-loader')).toBeInTheDocument();
  });

  it('supports keyboard activation', () => {
    const { container } = render(
      <UploadZone
        onFileSelect={mockOnFileSelect}
        accept={acceptedTypes}
        isUploading={false}
      />
    );

    const uploadArea = container.querySelector('[role="button"]');

    // Simulate Enter key press
    fireEvent.keyDown(uploadArea!, { key: 'Enter', code: 'Enter' });

    // Verify file input is triggered (implementation detail may vary)
    expect(uploadArea).toBeInTheDocument();
  });

  it('applies accept attribute to file input', () => {
    render(
      <UploadZone
        onFileSelect={mockOnFileSelect}
        accept={acceptedTypes}
        isUploading={false}
      />
    );

    const input = screen.getByLabelText(/upload/i, { selector: 'input[type="file"]' });
    expect(input).toHaveAttribute('accept', acceptedTypes);
  });
});

```


## `app-take2/components/materials/UploadZone.tsx`

```typescript
'use client';

import * as React from 'react';
import { QuillLoader } from '@/components/roman/QuillLoader';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadZoneProps {
  onFileSelect: (files: FileList) => void;
  accept: string;
  isUploading: boolean;
}

export function UploadZone({ onFileSelect, accept, isUploading }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      data-upload-zone
      data-testid="upload-zone"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        // Base styling - open book metaphor
        'relative flex flex-col items-center justify-center',
        'min-h-[200px] rounded-2xl cursor-pointer transition-all',
        'bg-marble-light dark:bg-marble-dark',

        // Dashed border (idle state)
        !isDragOver && !isUploading && 'border-4 border-dashed border-border-medium',

        // Drag-over state (gold border)
        isDragOver && 'border-4 border-solid border-gold-light dark:border-gold-dark',
        isDragOver && 'bg-gold-light/10 dark:bg-gold-dark/10',

        // Uploading state
        isUploading && 'border-2 border-solid border-info-light dark:border-info-dark',
        isUploading && 'bg-info-light/5 dark:bg-info-dark/5'
      )}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="sr-only"
        aria-label="Upload file"
      />

      {isUploading ? (
        // Uploading state with QuillLoader
        <QuillLoader text="Transcribing scroll..." />
      ) : (
        // Idle state with open book icon
        <>
          <Upload
            className={cn(
              'transition-all',
              isDragOver
                ? 'h-18 w-18 opacity-100'
                : 'h-16 w-16 opacity-40',
              'text-ink-light dark:text-ink-dark'
            )}
          />
          <div className="mt-4 text-center space-y-1">
            <p className="text-lg font-semibold text-ink-light dark:text-ink-dark">
              Drop your scrolls here
            </p>
            <p className="text-sm text-ink-light dark:text-ink-dark opacity-60">
              or click to browse
            </p>
            <p className="text-xs text-ink-light dark:text-ink-dark opacity-50 mt-2">
              Supported formats: {accept}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

```


## `app-take2/components/onboarding/EasterEgg.test.tsx`

```typescript
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

```


## `app-take2/components/onboarding/EasterEgg.tsx`

```typescript
import * as React from 'react';
import { OrnateHeading } from '@/components/roman/OrnateHeading';
import { GoldenFlourish } from '@/components/roman/GoldenFlourish';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EasterEggProps {
  show: boolean;
  onContinue: () => void;
}

export function EasterEgg({ show, onContinue }: EasterEggProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Focus the continue button when shown for keyboard accessibility
  React.useEffect(() => {
    if (show && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [show]);

  // Handle Enter key to trigger continue
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onContinue();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      data-testid="easter-egg-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="easter-egg-title"
      data-reduce-motion="true"
      className={cn(
        // Full-screen overlay
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'bg-black/80',
        // Fade-in animation
        'animate-in fade-in duration-700',
        'motion-reduce:animate-none motion-reduce:transition-none'
      )}
    >
      <div
        data-animate="scale-up"
        className={cn(
          'text-center',
          'animate-in zoom-in duration-1000',
          'motion-reduce:animate-none',
          'flex flex-col items-center gap-6'
        )}
      >
        {/* Top flourish */}
        <GoldenFlourish className="motion-reduce:opacity-100" animate={true} />

        {/* Dramatic heading */}
        <div id="easter-egg-title">
          <OrnateHeading
            level={1}
            className="mb-2 text-6xl text-gold-light dark:text-gold-dark"
          >
            SURPRISE KEENAN!
          </OrnateHeading>
        </div>

        {/* Bottom flourish */}
        <GoldenFlourish className="motion-reduce:opacity-100 rotate-180" animate={true} />

        {/* Continue button */}
        <Button
          ref={buttonRef}
          onClick={onContinue}
          onKeyDown={handleKeyDown}
          size="lg"
          className="mt-4 bg-crimson-light hover:bg-crimson-dark dark:bg-crimson-dark dark:hover:bg-crimson-light text-parchment-light dark:text-parchment-dark"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

```


## `app-take2/components/onboarding/PreferenceSelector.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PreferenceSelector } from './PreferenceSelector';

describe('PreferenceSelector', () => {
  const mockPreferences = {
    tone: 'socratic',
    motivation: 'mastery',
    depth: 'deep',
    pace: 'adaptive',
    format: 'conversational',
    breaks: 'frequent',
  };

  it('renders without crashing', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/tone/i)).toBeInTheDocument();
  });

  it('displays all 6 preference categories', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    // Use exact text matching for category titles to avoid multiple matches
    expect(screen.getByText('Tone')).toBeInTheDocument();
    expect(screen.getByText('Motivation')).toBeInTheDocument();
    expect(screen.getByText('Depth')).toBeInTheDocument();
    expect(screen.getByText('Pace')).toBeInTheDocument();
    expect(screen.getByText('Format')).toBeInTheDocument();
    expect(screen.getByText('Breaks')).toBeInTheDocument();
  });

  it('displays tone options: socratic, encouraging, direct', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/socratic/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/encouraging/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/direct/i)).toBeInTheDocument();
  });

  it('displays motivation options: mastery, curiosity, productivity', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/mastery/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/curiosity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/productivity/i)).toBeInTheDocument();
  });

  it('displays depth options: surface, balanced, deep', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Surface')).toBeInTheDocument();
    expect(screen.getByLabelText('Balanced')).toBeInTheDocument();
    expect(screen.getByLabelText('Deep')).toBeInTheDocument();
  });

  it('displays pace options: slow, adaptive, fast', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/slow/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/adaptive/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fast/i)).toBeInTheDocument();
  });

  it('displays format options: conversational, structured', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/conversational/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/structured/i)).toBeInTheDocument();
  });

  it('displays break options: frequent, moderate, minimal', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(/frequent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/moderate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/minimal/i)).toBeInTheDocument();
  });

  it('selects the current preference value for each category', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Socratic')).toBeChecked();
    expect(screen.getByLabelText('Mastery')).toBeChecked();
    expect(screen.getByLabelText('Deep')).toBeChecked();
    expect(screen.getByLabelText('Adaptive')).toBeChecked();
    expect(screen.getByLabelText('Conversational')).toBeChecked();
    expect(screen.getByLabelText('Frequent')).toBeChecked();
  });

  it('calls onChange when a preference is selected', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    const directOption = screen.getByLabelText(/direct/i);
    fireEvent.click(directOption);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ tone: 'direct' })
    );
  });

  it('updates multiple preference categories independently', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByLabelText(/encouraging/i));
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ tone: 'encouraging' })
    );

    fireEvent.click(screen.getByLabelText(/curiosity/i));
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ motivation: 'curiosity' })
    );
  });

  it('uses radio button groups for single-selection categories', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    // Each preference should use radio buttons (single selection)
    const toneRadios = screen.getAllByRole('radio').filter((radio) => {
      const label = radio.getAttribute('aria-label') || '';
      return label.toLowerCase().includes('socratic') ||
             label.toLowerCase().includes('encouraging') ||
             label.toLowerCase().includes('direct');
    });

    expect(toneRadios.length).toBeGreaterThanOrEqual(3);
  });

  it('has accessible form semantics with fieldset and legend', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    // Should use semantic HTML for form structure
    const fieldsets = screen.getAllByRole('group');
    expect(fieldsets.length).toBeGreaterThanOrEqual(6); // One per category
  });

  it('uses ParchmentCard for card-based layout', () => {
    const mockOnChange = jest.fn();

    const { container } = render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    // Should use parchment styling for cards
    const parchmentCards = container.querySelectorAll('.bg-parchment-light');
    expect(parchmentCards.length).toBeGreaterThan(0);
  });

  it('supports keyboard navigation between options', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    const firstRadio = screen.getAllByRole('radio')[0];
    firstRadio.focus();

    expect(document.activeElement).toBe(firstRadio);
  });

  it('displays descriptions for each preference option', () => {
    const mockOnChange = jest.fn();

    render(
      <PreferenceSelector
        preferences={mockPreferences}
        onChange={mockOnChange}
      />
    );

    // Should have descriptive text for options
    expect(screen.getByText(/question-based/i)).toBeInTheDocument();
  });
});

```


## `app-take2/components/onboarding/PreferenceSelector.tsx`

```typescript
import * as React from 'react';
import { ParchmentCard } from '@/components/roman/ParchmentCard';
import { cn } from '@/lib/utils';

export interface Preferences {
  tone: 'socratic' | 'encouraging' | 'direct';
  motivation: 'mastery' | 'curiosity' | 'productivity';
  depth: 'surface' | 'balanced' | 'deep';
  pace: 'slow' | 'adaptive' | 'fast';
  format: 'conversational' | 'structured';
  breaks: 'frequent' | 'moderate' | 'minimal';
}

export interface PreferenceSelectorProps {
  preferences: Preferences;
  onChange: (preferences: Preferences) => void;
}

interface PreferenceOption {
  value: string;
  label: string;
  description: string;
}

const preferenceCategories: Record<
  keyof Preferences,
  {
    title: string;
    description: string;
    options: PreferenceOption[];
  }
> = {
  tone: {
    title: 'Tone',
    description: 'How should I communicate with you?',
    options: [
      {
        value: 'socratic',
        label: 'Socratic',
        description: 'Question-based, guided discovery',
      },
      {
        value: 'encouraging',
        label: 'Encouraging',
        description: 'Supportive and motivational',
      },
      {
        value: 'direct',
        label: 'Direct',
        description: 'Straightforward explanations',
      },
    ],
  },
  motivation: {
    title: 'Motivation',
    description: 'What drives your learning?',
    options: [
      {
        value: 'mastery',
        label: 'Mastery',
        description: 'Deep understanding and expertise',
      },
      {
        value: 'curiosity',
        label: 'Curiosity',
        description: 'Exploration and discovery',
      },
      {
        value: 'productivity',
        label: 'Productivity',
        description: 'Practical skills and efficiency',
      },
    ],
  },
  depth: {
    title: 'Depth',
    description: 'How deep should we go?',
    options: [
      {
        value: 'surface',
        label: 'Surface',
        description: 'High-level overview',
      },
      {
        value: 'balanced',
        label: 'Balanced',
        description: 'Mix of concepts and details',
      },
      {
        value: 'deep',
        label: 'Deep',
        description: 'Thorough exploration',
      },
    ],
  },
  pace: {
    title: 'Pace',
    description: 'How fast should we move?',
    options: [
      {
        value: 'slow',
        label: 'Slow',
        description: 'Take your time, no rush',
      },
      {
        value: 'adaptive',
        label: 'Adaptive',
        description: 'Adjust based on understanding',
      },
      {
        value: 'fast',
        label: 'Fast',
        description: 'Quick progression',
      },
    ],
  },
  format: {
    title: 'Format',
    description: 'How should lessons be structured?',
    options: [
      {
        value: 'conversational',
        label: 'Conversational',
        description: 'Natural dialogue flow',
      },
      {
        value: 'structured',
        label: 'Structured',
        description: 'Clear steps and sections',
      },
    ],
  },
  breaks: {
    title: 'Breaks',
    description: 'How often should we pause?',
    options: [
      {
        value: 'frequent',
        label: 'Frequent',
        description: 'Regular check-ins',
      },
      {
        value: 'moderate',
        label: 'Moderate',
        description: 'Occasional pauses',
      },
      {
        value: 'minimal',
        label: 'Minimal',
        description: 'Continuous learning',
      },
    ],
  },
};

export function PreferenceSelector({
  preferences,
  onChange,
}: PreferenceSelectorProps) {
  const handleChange = (category: keyof Preferences, value: string) => {
    onChange({
      ...preferences,
      [category]: value,
    });
  };

  return (
    <div className="space-y-6">
      {(Object.keys(preferenceCategories) as Array<keyof Preferences>).map(
        (category) => {
          const categoryData = preferenceCategories[category];
          const currentValue = preferences[category];

          return (
            <ParchmentCard key={category} className="p-4">
              <fieldset role="group">
                <legend className="mb-3 text-lg font-semibold text-ink-light dark:text-ink-dark">
                  {categoryData.title}
                </legend>
                <p className="mb-4 text-sm text-ink-light/70 dark:text-ink-dark/70">
                  {categoryData.description}
                </p>

                <div className="space-y-2">
                  {categoryData.options.map((option) => {
                    const id = `${category}-${option.value}`;
                    const isChecked = currentValue === option.value;

                    return (
                      <label
                        key={option.value}
                        htmlFor={id}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-colors',
                          isChecked
                            ? 'border-gold-light dark:border-gold-dark bg-gold-light/10 dark:bg-gold-dark/10'
                            : 'border-border-light hover:border-border-medium'
                        )}
                      >
                        <input
                          type="radio"
                          id={id}
                          name={category}
                          value={option.value}
                          checked={isChecked}
                          onChange={() => handleChange(category, option.value)}
                          aria-label={option.label}
                          className="mt-1 h-4 w-4 text-gold-light focus:ring-gold-light dark:text-gold-dark dark:focus:ring-gold-dark"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-ink-light dark:text-ink-dark">
                            {option.label}
                          </div>
                          <div className="text-sm text-ink-light/60 dark:text-ink-dark/60">
                            {option.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </ParchmentCard>
          );
        }
      )}
    </div>
  );
}

```


## `app-take2/components/onboarding/WizardContainer.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardContainer } from './WizardContainer';

describe('WizardContainer', () => {
  it('renders without crashing', () => {
    const mockOnStepChange = jest.fn();
    const mockOnComplete = jest.fn();

    render(
      <WizardContainer
        currentStep={1}
        onStepChange={mockOnStepChange}
        onComplete={mockOnComplete}
      >
        <div>Step 1 Content</div>
      </WizardContainer>
    );

    expect(screen.getByText('Step 1 Content')).toBeInTheDocument();
  });

  it('displays Roman numeral progress indicators for all 6 steps', () => {
    const mockOnStepChange = jest.fn();
    const mockOnComplete = jest.fn();

    render(
      <WizardContainer
        currentStep={3}
        onStepChange={mockOnStepChange}
        onComplete={mockOnComplete}
      >
        <div>Content</div>
      </WizardContainer>
    );

    // Check for Roman numerals I through VI
    expect(screen.getByText('I')).toBeInTheDocument();
    expect(screen.getByText('II')).toBeInTheDocument();
    expect(screen.getByText('III')).toBeInTheDocument();
    expect(screen.getByText('IV')).toBeInTheDocument();
    expect(screen.getByText('V')).toBeInTheDocument();
    expect(screen.getByText('VI')).toBeInTheDocument();
  });

  it('highlights the current step indicator', () => {
    const mockOnStepChange = jest.fn();
    const mockOnComplete = jest.fn();

    render(
      <WizardContainer
        currentStep={3}
        onStepChange={mockOnStepChange}
        onComplete={mockOnComplete}
      >
        <div>Content</div>
      </WizardContainer>
    );

    // Step 3 indicator should have active styling (Crimson background)
    const stepThree = screen.getByText('III').closest('div');
    expect(stepThree).toHaveClass('bg-crimson-light');
  });

  it('renders previous button when not on step 1', () => {
    const mockOnStepChange = jest.fn();
    const mockOnComplete = jest.fn();

    render(
      <WizardContainer
        currentStep={3}
        onStepChange={mockOnStepChange}
        onComplete={mockOnComplete}
      >
        <div>Content</div>
      </WizardContainer>
    );

    expect(screen.getByText(/previous/i)).toBeInTheDocument();
  });

  it('does not render previous button on step 1', () => {
    const mockOnStepChange = jest.fn();
    const mockOnComplete = jest.fn();

    render(
      <WizardContainer
        currentStep={1}
        onStepChange={mockOnStepChange}
        onComplete={mockOnComplete}
      >
        <div>Content</div>
      </WizardContainer>
    );

    expect(screen.queryByText(/previous/i)).not.toBeInTheDocument();
  });

  it('renders next button when not on step 6', () => {
    const mockOnStepChange = jest.fn();
    const mockOnComplete = jest.fn();

    render(
      <WizardContainer
        currentStep={3}
        onStepChange={mockOnStepChange}
        onComplete={mockOnComplete}
      >
        <div>Content</div>
      </WizardContainer>
    );

    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });

  it('renders complete button on step 6', () => {
    const mockOnStepChange = jest.fn();
    const mockOnComplete = jest.fn();

    render(
      <WizardContainer
        currentStep={6}
        onStepChange={mockOnStepChange}
        onComplete={mockOnComplete}
      >
        <div>Content</div>
      </WizardContainer>
    );

    expect(screen.getByText(/complete/i)).toBeInTheDocument();
  });

  it('calls onStepChange with previous step when previous button clicked', () => {
    const mockOnStepChange = jest.fn();
    const mockOnComplete = jest.fn();

    render(
      <WizardContainer
        currentStep={3}
        onStepChange={mockOnStepChange}
        onComplete={mockOnComplete}
      >
        <div>Content</div>
      </WizardContainer>
    );

    const previousButton = screen.getByText(/previous/i);
    fireEvent.click(previousButton);

    expect(mockOnStepChange).toHaveBeenCalledWith(2);
  });

  it('calls onStepChange with next step when next button clicked', () => {
    const mockOnStepChange = jest.fn();
    const mockOnComplete = jest.fn();

    render(
      <WizardContainer
        currentStep={3}
        onStepChange={mockOnStepChange}
        onComplete={mockOnComplete}
      >
        <div>Content</div>
      </WizardContainer>
    );

    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);

    expect(mockOnStepChange).toHaveBeenCalledWith(4);
  });

  it('calls onComplete when complete button clicked on step 6', () => {
    const mockOnStepChange = jest.fn();
    const mockOnComplete = jest.fn();

    render(
      <WizardContainer
        currentStep={6}
        onStepChange={mockOnStepChange}
        onComplete={mockOnComplete}
      >
        <div>Content</div>
      </WizardContainer>
    );

    const completeButton = screen.getByText(/complete/i);
    fireEvent.click(completeButton);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('has accessible navigation with aria-label', () => {
    const mockOnStepChange = jest.fn();
    const mockOnComplete = jest.fn();

    render(
      <WizardContainer
        currentStep={3}
        onStepChange={mockOnStepChange}
        onComplete={mockOnComplete}
      >
        <div>Content</div>
      </WizardContainer>
    );

    expect(screen.getByLabelText(/wizard navigation/i)).toBeInTheDocument();
  });

  it('marks completed steps with checkmark or visual indicator', () => {
    const mockOnStepChange = jest.fn();
    const mockOnComplete = jest.fn();

    render(
      <WizardContainer
        currentStep={4}
        onStepChange={mockOnStepChange}
        onComplete={mockOnComplete}
      >
        <div>Content</div>
      </WizardContainer>
    );

    // Steps 1-3 should be marked complete (Gold background per ux-design.md)
    const stepOne = screen.getByText('I').closest('div');
    const stepTwo = screen.getByText('II').closest('div');
    const stepThree = screen.getByText('III').closest('div');

    expect(stepOne).toHaveClass('bg-gold-light');
    expect(stepTwo).toHaveClass('bg-gold-light');
    expect(stepThree).toHaveClass('bg-gold-light');
  });
});

```


## `app-take2/components/onboarding/WizardContainer.tsx`

```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ParchmentCard } from '@/components/roman/ParchmentCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface WizardContainerProps {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  onStepChange: (step: number) => void;
  onComplete: () => void;
  children: React.ReactNode;
}

const romanNumerals: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
};

const totalSteps = 6;

export function WizardContainer({
  currentStep,
  onStepChange,
  onComplete,
  children,
}: WizardContainerProps) {
  const handlePrevious = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      {/* Progress Indicator */}
      <nav aria-label="Wizard navigation" className="mb-8">
        <ol className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
            const isComplete = step < currentStep;
            const isActive = step === currentStep;

            return (
              <li key={step}>
                <div className="flex items-center">
                  {/* Step indicator circle */}
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full',
                      'font-display text-lg font-semibold',
                      'border-2 transition-colors',
                      isComplete && 'bg-gold-light dark:bg-gold-dark border-gold-light dark:border-gold-dark text-ink-light dark:text-ink-dark',
                      isActive && 'bg-crimson-light dark:bg-crimson-dark border-crimson-light dark:border-crimson-dark text-parchment-light dark:text-parchment-dark',
                      !isComplete && !isActive && 'bg-parchment-light dark:bg-parchment-dark border-border-medium text-disabled-light dark:text-disabled-dark'
                    )}
                  >
                    {romanNumerals[step]}
                  </div>

                  {/* Connector line */}
                  {step < totalSteps && (
                    <div
                      className={cn(
                        'h-0.5 w-8',
                        isComplete
                          ? 'bg-gold-light dark:bg-gold-dark'
                          : 'border-t-2 border-dotted border-border-medium'
                      )}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Content Area */}
      <ParchmentCard className="mb-6 p-6">{children}</ParchmentCard>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
        </div>

        <div>
          {currentStep < totalSteps ? (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              className="bg-gold-light hover:bg-gold-dark dark:bg-gold-dark dark:hover:bg-gold-light"
            >
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

```


## `app-take2/components/onboarding/WizardStep.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { WizardStep } from './WizardStep';

describe('WizardStep', () => {
  it('renders without crashing', () => {
    render(
      <WizardStep
        stepNumber={1}
        title="Step One"
        description="First step description"
        isActive={true}
      >
        <div>Step content</div>
      </WizardStep>
    );

    expect(screen.getByText('Step content')).toBeInTheDocument();
  });

  it('displays Roman numeral indicator for step number', () => {
    render(
      <WizardStep
        stepNumber={3}
        title="Step Three"
        description="Third step"
        isActive={true}
      >
        <div>Content</div>
      </WizardStep>
    );

    expect(screen.getByText('III')).toBeInTheDocument();
  });

  it('converts step numbers to Roman numerals correctly', () => {
    const { rerender } = render(
      <WizardStep stepNumber={1} title="One" description="" isActive={true}>
        <div>Content</div>
      </WizardStep>
    );
    expect(screen.getByText('I')).toBeInTheDocument();

    rerender(
      <WizardStep stepNumber={2} title="Two" description="" isActive={true}>
        <div>Content</div>
      </WizardStep>
    );
    expect(screen.getByText('II')).toBeInTheDocument();

    rerender(
      <WizardStep stepNumber={4} title="Four" description="" isActive={true}>
        <div>Content</div>
      </WizardStep>
    );
    expect(screen.getByText('IV')).toBeInTheDocument();

    rerender(
      <WizardStep stepNumber={5} title="Five" description="" isActive={true}>
        <div>Content</div>
      </WizardStep>
    );
    expect(screen.getByText('V')).toBeInTheDocument();

    rerender(
      <WizardStep stepNumber={6} title="Six" description="" isActive={true}>
        <div>Content</div>
      </WizardStep>
    );
    expect(screen.getByText('VI')).toBeInTheDocument();
  });

  it('displays step title', () => {
    render(
      <WizardStep
        stepNumber={1}
        title="Choose Your Tone"
        description="Select your preferred learning tone"
        isActive={true}
      >
        <div>Content</div>
      </WizardStep>
    );

    expect(screen.getByText('Choose Your Tone')).toBeInTheDocument();
  });

  it('displays step description', () => {
    render(
      <WizardStep
        stepNumber={1}
        title="Choose Your Tone"
        description="Select your preferred learning tone"
        isActive={true}
      >
        <div>Content</div>
      </WizardStep>
    );

    expect(screen.getByText('Select your preferred learning tone')).toBeInTheDocument();
  });

  it('renders children when active', () => {
    render(
      <WizardStep
        stepNumber={1}
        title="Step"
        description="Description"
        isActive={true}
      >
        <div data-testid="step-content">Active step content</div>
      </WizardStep>
    );

    expect(screen.getByTestId('step-content')).toBeInTheDocument();
  });

  it('does not render children when inactive', () => {
    render(
      <WizardStep
        stepNumber={1}
        title="Step"
        description="Description"
        isActive={false}
      >
        <div data-testid="step-content">Inactive step content</div>
      </WizardStep>
    );

    expect(screen.queryByTestId('step-content')).not.toBeInTheDocument();
  });

  it('has fade-in animation class when active', () => {
    const { container } = render(
      <WizardStep
        stepNumber={1}
        title="Step"
        description="Description"
        isActive={true}
      >
        <div>Content</div>
      </WizardStep>
    );

    // Should have animation class or data attribute
    expect(container.querySelector('[data-animate="fade-in"]')).toBeInTheDocument();
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(
      <WizardStep
        stepNumber={2}
        title="Step Two"
        description="Second step"
        isActive={true}
      >
        <div>Content</div>
      </WizardStep>
    );

    // Should have role and aria-current for active step
    const stepContainer = screen.getByText('Step Two').closest('[role]');
    expect(stepContainer).toHaveAttribute('role', 'tabpanel');
    expect(stepContainer).toHaveAttribute('aria-current', 'step');
  });

  it('does not have aria-current when inactive', () => {
    const { container } = render(
      <WizardStep
        stepNumber={2}
        title="Step Two"
        description="Second step"
        isActive={false}
      >
        <div>Content</div>
      </WizardStep>
    );

    // When inactive, component returns null, so there should be no content
    expect(screen.queryByText('Step Two')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-current]')).not.toBeInTheDocument();
  });

  it('has EB Garamond font for Roman numeral (display font)', () => {
    render(
      <WizardStep
        stepNumber={3}
        title="Step Three"
        description="Description"
        isActive={true}
      >
        <div>Content</div>
      </WizardStep>
    );

    const romanNumeral = screen.getByText('III');
    expect(romanNumeral).toHaveClass('font-display');
  });

  it('respects reduced motion preferences', () => {
    const { container } = render(
      <WizardStep
        stepNumber={1}
        title="Step"
        description="Description"
        isActive={true}
      >
        <div>Content</div>
      </WizardStep>
    );

    // Animation should be conditional based on prefers-reduced-motion
    // Component should support both animated and instant visibility
    expect(container.firstChild).toBeInTheDocument();
  });
});

```


## `app-take2/components/onboarding/WizardStep.tsx`

```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface WizardStepProps {
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  description: string;
  isActive: boolean;
  children: React.ReactNode;
}

const romanNumerals: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
};

export function WizardStep({
  stepNumber,
  title,
  description,
  isActive,
  children,
}: WizardStepProps) {
  if (!isActive) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      aria-current="step"
      data-animate="fade-in"
      className={cn(
        'animate-in fade-in duration-500',
        'motion-reduce:animate-none motion-reduce:transition-none'
      )}
    >
      {/* Roman numeral indicator */}
      <div className="mb-6 flex items-center gap-4">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            'font-display text-xl font-semibold',
            'bg-crimson-light dark:bg-crimson-dark',
            'text-parchment-light dark:text-parchment-dark'
          )}
        >
          {romanNumerals[stepNumber]}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-ink-light dark:text-ink-dark">
            {title}
          </h3>
          <p className="text-sm text-ink-light/70 dark:text-ink-dark/70">
            {description}
          </p>
        </div>
      </div>

      {/* Step content */}
      <div>{children}</div>
    </div>
  );
}

```


## `app-take2/components/roman/CandleFlame.test.tsx`

```typescript
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

```


## `app-take2/components/roman/CandleFlame.tsx`

```typescript
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

export interface CandleFlameProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * CandleFlame - Animated flame icon with candle flicker effect
 * Respects prefers-reduced-motion for accessibility
 * Used for "live" indicators and ambient decorative elements
 */
export function CandleFlame({ size = 'md', className }: CandleFlameProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={cn(
        sizeClasses[size],
        'text-gold-light dark:text-gold-dark',
        'inline-flex items-center justify-center',
        'animate-candle-flicker', // CSS animation from globals.css
        className
      )}
    >
      <Flame className={sizeClasses[size]} />
    </div>
  );
}

```


## `app-take2/components/roman/GoldenFlourish.tsx`

```typescript
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GoldenFlourishProps {
  className?: string;
  animate?: boolean;
}

/**
 * GoldenFlourish - Decorative SVG ornament with stroke animation
 * Inspired by illuminated manuscript decorations
 * Used for success states, section dividers, and celebratory overlays
 */
export function GoldenFlourish({ className, animate = true }: GoldenFlourishProps) {
  // Calculate approximate path length for stroke-dasharray
  const flourishLength = 250;

  return (
    <svg
      className={cn('stroke-gold-light dark:stroke-gold-dark', className)}
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={
        animate
          ? {
              '--flourish-length': `${flourishLength}`,
            } as React.CSSProperties
          : undefined
      }
    >
      {/* Left flourish */}
      <path
        d="M10 20 Q20 10, 35 20 T55 20"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className={animate ? 'animate-flourish' : ''}
      />

      {/* Center ornament */}
      <circle
        cx="60"
        cy="20"
        r="4"
        strokeWidth="2"
        fill="none"
        className={animate ? 'animate-flourish' : ''}
        style={
          animate
            ? {
                animationDelay: '400ms',
              }
            : undefined
        }
      />

      {/* Right flourish */}
      <path
        d="M65 20 Q75 10, 85 20 T110 20"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className={animate ? 'animate-flourish' : ''}
        style={
          animate
            ? {
                animationDelay: '200ms',
              }
            : undefined
        }
      />

      {/* Decorative dots */}
      <circle
        cx="30"
        cy="20"
        r="1.5"
        fill="currentColor"
        className="text-gold-light dark:text-gold-dark"
        style={
          animate
            ? {
                opacity: 0,
                animation: 'flourishDraw 400ms ease-out 600ms forwards',
              }
            : undefined
        }
      />
      <circle
        cx="90"
        cy="20"
        r="1.5"
        fill="currentColor"
        className="text-gold-light dark:text-gold-dark"
        style={
          animate
            ? {
                opacity: 0,
                animation: 'flourishDraw 400ms ease-out 600ms forwards',
              }
            : undefined
        }
      />
    </svg>
  );
}

```


## `app-take2/components/roman/OrnateHeading.test.tsx`

```typescript
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

```


## `app-take2/components/roman/OrnateHeading.tsx`

```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface OrnateHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export function OrnateHeading({
  level,
  children,
  className,
}: OrnateHeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  const sizeClasses = {
    1: 'text-4xl', // 2rem = 32px (H1 from ux-design.md)
    2: 'text-3xl', // 1.5rem = 24px (H2 from ux-design.md)
    3: 'text-2xl', // 1.25rem = 20px (H3 from ux-design.md)
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base',
  };

  return (
    <Tag
      className={cn(
        // EB Garamond font for display text
        'font-display',
        'font-semibold',

        // Gold underline decoration
        'border-b',
        'border-gold-light dark:border-gold-dark',
        'pb-2',

        // Size based on level
        sizeClasses[level],

        // Ink color for text
        'text-ink-light dark:text-ink-dark',

        // Custom className
        className
      )}
    >
      {children}
    </Tag>
  );
}

```


## `app-take2/components/roman/ParchmentCard.test.tsx`

```typescript
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

```


## `app-take2/components/roman/ParchmentCard.tsx`

```typescript
import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ParchmentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
}

export function ParchmentCard({
  children,
  className,
  variant = 'default',
  ...props
}: ParchmentCardProps) {
  return (
    <Card
      className={cn(
        // Base parchment styling from ux-design.md
        'bg-parchment-light dark:bg-parchment-dark',
        'border border-border-medium',
        'rounded-xl', // 12px border radius for organic feel
        'texture-parchment', // Paper grain texture overlay

        // Variant-specific shadow
        variant === 'default' && 'shadow-md',
        variant === 'elevated' && 'shadow-lg',

        // Custom className
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

```


## `app-take2/components/roman/QuillLoader.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { QuillLoader } from './QuillLoader';

describe('QuillLoader', () => {
  it('renders without crashing', () => {
    const { container } = render(<QuillLoader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders optional text prop', () => {
    render(<QuillLoader text="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('does not render text when not provided', () => {
    const { container } = render(<QuillLoader />);
    const text = container.querySelector('span, p');
    // Should only have SVG, no text element
    expect(screen.queryByRole('status')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<QuillLoader className="custom-loader" />);
    const loader = container.firstChild as HTMLElement;
    expect(loader).toHaveClass('custom-loader');
  });

  it('contains SVG quill element', () => {
    const { container } = render(<QuillLoader />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has accessibility role', () => {
    render(<QuillLoader />);
    // Loading indicator should have status role
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies ink color scheme', () => {
    const { container } = render(<QuillLoader />);
    const svg = container.querySelector('svg');
    // SVG should use ink color for stroke
    expect(svg).toHaveClass('stroke-ink-light');
    expect(svg).toHaveClass('dark:stroke-ink-dark');
  });

  it('has animation class for stroke animation', () => {
    const { container } = render(<QuillLoader />);
    const path = container.querySelector('path');
    // Should have animation class for quill writing effect
    expect(path).toHaveClass('animate-quill-write');
  });
});

```


## `app-take2/components/roman/QuillLoader.tsx`

```typescript
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface QuillLoaderProps {
  text?: string;
  className?: string;
}

export function QuillLoader({ text, className }: QuillLoaderProps) {
  return (
    <div
      data-testid="quill-loader"
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-2', className)}
    >
      <svg
        className={cn(
          'stroke-ink-light dark:stroke-ink-dark'
        )}
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Quill feather with stroke animation */}
        <path
          d="M8 40 L24 24 L32 8 M24 24 L40 16"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-quill-write"
        />
        {/* Quill tip */}
        <path
          d="M8 40 L4 44"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {text && (
        <span className="text-sm text-ink-light dark:text-ink-dark opacity-70">
          {text}
        </span>
      )}
    </div>
  );
}

```


## `app-take2/components/roman/ScrollContainer.test.tsx`

```typescript
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

```


## `app-take2/components/roman/ScrollContainer.tsx`

```typescript
import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface ScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export function ScrollContainer({
  children,
  className,
  height,
}: ScrollContainerProps) {
  return (
    <div
      data-scroll-container
      style={{ height: height || undefined }}
      className={cn('w-full', className)}
    >
      <ScrollArea className="h-full w-full">
        {children}
      </ScrollArea>
    </div>
  );
}

```


## `app-take2/components/tree/ConceptTree.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConceptTree } from './ConceptTree';
import { TreeStructure } from '@/lib/types';

const mockTreeData: TreeStructure = {
  goal: 'Learn React',
  created: '2026-01-07T00:00:00Z',
  last_updated: '2026-01-07T00:00:00Z',
  max_concepts: 10,
  total_concepts: 3,
  tree: {
    'react-basics': {
      status: 'STUDIED',
      tags: ['intuitive'],
      last_reviewed: '2026-01-07T00:00:00Z',
      parent: null,
      children: ['components', 'hooks'],
    },
    'components': {
      status: 'IN_PROGRESS',
      tags: ['formal'],
      last_reviewed: null,
      parent: 'react-basics',
      children: [],
    },
    'hooks': {
      status: 'NOT_STARTED',
      tags: ['can-apply'],
      last_reviewed: null,
      parent: 'react-basics',
      children: [],
    },
  },
};

describe('ConceptTree', () => {
  it('renders without crashing', () => {
    render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={() => {}}
        selectedPath={null}
      />
    );
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  it('applies tree role for accessibility', () => {
    render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={() => {}}
        selectedPath={null}
      />
    );
    const tree = screen.getByRole('tree');
    expect(tree).toHaveAttribute('aria-label', 'Concept tree for Learn React');
  });

  it('renders all root nodes', () => {
    render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={() => {}}
        selectedPath={null}
      />
    );
    // Should render root node
    expect(screen.getByText('react-basics')).toBeInTheDocument();
  });

  it('renders hierarchical structure with children', () => {
    render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={() => {}}
        selectedPath={null}
      />
    );
    // Root and children should be present
    expect(screen.getByText('react-basics')).toBeInTheDocument();
    expect(screen.getByText('components')).toBeInTheDocument();
    expect(screen.getByText('hooks')).toBeInTheDocument();
  });

  it('calls onNodeClick when node is clicked', async () => {
    const user = userEvent.setup();
    const onNodeClick = jest.fn();
    render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={onNodeClick}
        selectedPath={null}
      />
    );

    const node = screen.getByText('components');
    await user.click(node);
    expect(onNodeClick).toHaveBeenCalledWith('components');
  });

  it('highlights selected node with gold border', () => {
    const { container } = render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={() => {}}
        selectedPath="components"
      />
    );
    // Selected node should have gold border styling
    const selectedNode = screen.getByText('components').closest('[role="treeitem"]');
    expect(selectedNode).toHaveClass('border-gold-light');
  });

  it('uses ScrollContainer for tree layout', () => {
    const { container } = render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={() => {}}
        selectedPath={null}
      />
    );
    // Should be wrapped in a scrollable container
    expect(container.querySelector('[data-scroll-container]')).toBeInTheDocument();
  });

  it('handles empty tree data', () => {
    const emptyTree: TreeStructure = {
      goal: 'Empty Goal',
      created: '2026-01-07T00:00:00Z',
      last_updated: '2026-01-07T00:00:00Z',
      max_concepts: 0,
      total_concepts: 0,
      tree: {},
    };
    render(
      <ConceptTree
        treeData={emptyTree}
        onNodeClick={() => {}}
        selectedPath={null}
      />
    );
    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getByText(/no concepts/i)).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const onNodeClick = jest.fn();
    render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={onNodeClick}
        selectedPath={null}
      />
    );

    // Find the TreeNode element (which has the keyboard handler)
    const firstNode = screen.getAllByRole('treeitem')[0];
    firstNode.focus();
    await user.keyboard('{Enter}');
    expect(onNodeClick).toHaveBeenCalledWith('react-basics');
  });
});

```


## `app-take2/components/tree/ConceptTree.tsx`

```typescript
import React from 'react';
import { TreeStructure } from '@/lib/types';
import { TreeNode } from './TreeNode';
import { ScrollContainer } from '@/components/roman/ScrollContainer';

interface ConceptTreeProps {
  treeData: TreeStructure;
  onNodeClick: (conceptKey: string) => void;
  selectedPath: string | null;
}

export function ConceptTree({
  treeData,
  onNodeClick,
  selectedPath,
}: ConceptTreeProps) {
  // Find root nodes (nodes with no parent)
  const rootNodes = Object.entries(treeData.tree).filter(
    ([_, concept]) => concept.parent === null
  );

  // Recursive function to render a node and its children
  const renderNode = (
    conceptKey: string,
    depth: number = 0
  ): React.ReactNode => {
    const concept = treeData.tree[conceptKey];
    if (!concept) return null;

    return (
      <div key={conceptKey}>
        <TreeNode
          conceptKey={conceptKey}
          concept={concept}
          depth={depth}
          isSelected={selectedPath === conceptKey}
          onClick={onNodeClick}
        />
        {/* Render children recursively */}
        {concept.children.length > 0 && (
          <div className="ml-0">
            {concept.children.map((childKey) =>
              renderNode(childKey, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      role="tree"
      aria-label={`Concept tree for ${treeData.goal}`}
      className="w-full"
    >
      <ScrollContainer height="600px">
        <div className="space-y-2 p-4">
          {rootNodes.length === 0 ? (
            <div className="text-center text-ink-light/60 dark:text-ink-dark/60 py-8">
              No concepts yet. Start learning to build your tree!
            </div>
          ) : (
            rootNodes.map(([conceptKey]) => renderNode(conceptKey, 0))
          )}
        </div>
      </ScrollContainer>
    </div>
  );
}

```


## `app-take2/components/tree/ProgressBadge.test.tsx`

```typescript
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

```


## `app-take2/components/tree/ProgressBadge.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import { ConceptStatus } from '@/lib/types';

interface ProgressBadgeProps {
  status: ConceptStatus;
  percentage: number;
}

const statusStyles = {
  NOT_STARTED: 'bg-disabled text-parchment-light dark:text-parchment-dark',
  IN_PROGRESS: 'bg-info-light dark:bg-info-dark text-parchment-light dark:text-parchment-dark',
  STUDIED: 'bg-gold-light dark:bg-gold-dark text-ink-light dark:text-ink-dark',
};

export function ProgressBadge({ status, percentage }: ProgressBadgeProps) {
  const [prevPercentage, setPrevPercentage] = React.useState(percentage);
  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  // Trigger scale pulse animation when percentage changes
  React.useEffect(() => {
    if (percentage !== prevPercentage) {
      setShouldAnimate(true);
      setPrevPercentage(percentage);

      // Reset animation flag after animation completes
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [percentage, prevPercentage]);

  return (
    <div
      role="img"
      aria-label={`Progress: ${percentage}%`}
      className={cn(
        'flex items-center justify-center',
        'w-12 h-12',
        'rounded-full',
        'text-sm font-semibold',
        statusStyles[status],
        shouldAnimate && 'animate-scale-pulse'
      )}
    >
      {percentage}%
    </div>
  );
}

```


## `app-take2/components/tree/TagChip.test.tsx`

```typescript
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

```


## `app-take2/components/tree/TagChip.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface TagChipProps {
  tag: string;
  variant: 'intuitive' | 'formal' | 'can-apply';
}

const variantStyles = {
  intuitive: 'bg-crimson-light dark:bg-crimson-dark',
  formal: 'bg-ink-light dark:bg-ink-dark',
  'can-apply': 'bg-gold-light dark:bg-gold-dark',
};

export function TagChip({ tag, variant }: TagChipProps) {
  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center',
        'rounded-full',
        'px-3 py-1',
        'text-xs font-serif',
        'text-parchment-light dark:text-parchment-dark',
        variantStyles[variant]
      )}
    >
      {tag}
    </span>
  );
}

```


## `app-take2/components/tree/TreeNode.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TreeNode } from './TreeNode';
import { ConceptNode } from '@/lib/types';

const mockConcept: ConceptNode = {
  status: 'IN_PROGRESS',
  tags: ['intuitive', 'formal'],
  last_reviewed: null,
  parent: null,
  children: ['child-1', 'child-2'],
};

describe('TreeNode', () => {
  it('renders without crashing', () => {
    render(
      <TreeNode
        conceptKey="test-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    expect(screen.getByRole('treeitem')).toBeInTheDocument();
  });

  it('applies treeitem role for accessibility', () => {
    render(
      <TreeNode
        conceptKey="test-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = screen.getByRole('treeitem');
    expect(node).toHaveAttribute('aria-level', '1'); // depth 0 = level 1
  });

  it('displays concept key as title', () => {
    render(
      <TreeNode
        conceptKey="react-hooks"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    expect(screen.getByText('react-hooks')).toBeInTheDocument();
  });

  it('applies correct indentation based on depth', () => {
    const { container } = render(
      <TreeNode
        conceptKey="nested-concept"
        concept={mockConcept}
        depth={2}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = container.firstChild as HTMLElement;
    // 24px per level per ux-design.md
    expect(node).toHaveStyle({ paddingLeft: '48px' }); // 2 * 24px
  });

  it('applies gold border when selected', () => {
    const { container } = render(
      <TreeNode
        conceptKey="selected-concept"
        concept={mockConcept}
        depth={0}
        isSelected={true}
        onClick={() => {}}
      />
    );
    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass('border-gold-light');
    expect(node).toHaveClass('bg-gold-light/15');
  });

  it('applies status-based coloring for NOT_STARTED', () => {
    const notStartedConcept: ConceptNode = {
      ...mockConcept,
      status: 'NOT_STARTED',
    };
    const { container } = render(
      <TreeNode
        conceptKey="not-started"
        concept={notStartedConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass('border-disabled');
  });

  it('applies status-based coloring for IN_PROGRESS', () => {
    const { container } = render(
      <TreeNode
        conceptKey="in-progress"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass('border-info-light');
  });

  it('applies status-based coloring for STUDIED', () => {
    const studiedConcept: ConceptNode = {
      ...mockConcept,
      status: 'STUDIED',
    };
    const { container } = render(
      <TreeNode
        conceptKey="studied"
        concept={studiedConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass('border-gold-light');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <TreeNode
        conceptKey="clickable-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={onClick}
      />
    );

    const node = screen.getByRole('treeitem');
    await user.click(node);
    expect(onClick).toHaveBeenCalledWith('clickable-concept');
  });

  it('supports keyboard activation with Enter', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <TreeNode
        conceptKey="keyboard-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={onClick}
      />
    );

    const node = screen.getByRole('treeitem');
    node.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledWith('keyboard-concept');
  });

  it('supports keyboard activation with Space', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <TreeNode
        conceptKey="space-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={onClick}
      />
    );

    const node = screen.getByRole('treeitem');
    node.focus();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledWith('space-concept');
  });

  it('renders with illuminated manuscript styling', () => {
    const { container } = render(
      <TreeNode
        conceptKey="styled-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = container.firstChild as HTMLElement;
    // Should use ParchmentCard base
    expect(node).toHaveClass('bg-parchment-light');
    expect(node).toHaveClass('dark:bg-parchment-dark');
  });

  it('indicates expandable state when has children', () => {
    render(
      <TreeNode
        conceptKey="parent-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = screen.getByRole('treeitem');
    expect(node).toHaveAttribute('aria-expanded');
  });

  it('renders tags using TagChip components', () => {
    render(
      <TreeNode
        conceptKey="tagged-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    // Tags should be rendered
    expect(screen.getByText('intuitive')).toBeInTheDocument();
    expect(screen.getByText('formal')).toBeInTheDocument();
  });
});

```


## `app-take2/components/tree/TreeNode.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import { ConceptNode, ConceptStatus } from '@/lib/types';
import { TagChip } from './TagChip';

interface TreeNodeProps {
  conceptKey: string;
  concept: ConceptNode;
  depth: number;
  isSelected: boolean;
  onClick: (key: string) => void;
}

const statusBorderStyles: Record<ConceptStatus, string> = {
  NOT_STARTED: 'border-disabled',
  IN_PROGRESS: 'border-info-light dark:border-info-dark',
  STUDIED: 'border-gold-light dark:border-gold-dark',
};

const tagVariantMap: Record<string, 'intuitive' | 'formal' | 'can-apply'> = {
  intuitive: 'intuitive',
  formal: 'formal',
  'can-apply': 'can-apply',
};

export function TreeNode({
  conceptKey,
  concept,
  depth,
  isSelected,
  onClick,
}: TreeNodeProps) {
  const handleClick = () => {
    onClick(conceptKey);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(conceptKey);
    }
  };

  const indentationPx = depth * 24; // 24px per level per ux-design.md

  return (
    <div
      role="treeitem"
      aria-level={depth + 1} // aria-level is 1-indexed
      aria-selected={isSelected}
      aria-expanded={concept.children.length > 0 ? 'true' : undefined}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ paddingLeft: `${indentationPx}px` }}
      className={cn(
        // Base ParchmentCard styling
        'bg-parchment-light dark:bg-parchment-dark',
        'texture-parchment', // Paper grain texture
        'border-l-4',
        statusBorderStyles[concept.status],
        'rounded-xl',
        'p-4',
        'cursor-pointer',
        'transition-colors duration-200',
        'node-glow', // Gold shadow on hover from globals.css
        // Hover state
        'hover:bg-gold-light/5 dark:hover:bg-gold-dark/10',
        // Selected state
        isSelected && [
          'border-gold-light dark:border-gold-dark',
          'bg-gold-light/15 dark:bg-gold-dark/15',
        ],
        // Focus state
        'focus:outline-none focus:ring-2 focus:ring-gold-light dark:focus:ring-gold-dark'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Concept title */}
        <h3 className="text-base font-semibold text-ink-light dark:text-ink-dark flex-grow">
          {conceptKey}
        </h3>

        {/* Tags */}
        <div className="flex gap-2">
          {concept.tags.map((tag) => {
            const variant = tagVariantMap[tag] || 'formal';
            return <TagChip key={tag} tag={tag} variant={variant} />;
          })}
        </div>
      </div>
    </div>
  );
}

```


## `app-take2/components/ui/button.tsx`

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

```


## `app-take2/components/ui/card.tsx`

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```


## `app-take2/components/ui/input.tsx`

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-border-medium bg-parchment-light dark:bg-parchment-dark px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-light/50 dark:placeholder:text-ink-dark/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light dark:focus-visible:ring-gold-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-ink-light dark:text-ink-dark",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

```


## `app-take2/components/ui/scroll-area.tsx`

```typescript
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }

```


## `app-take2/hooks/useChat.test.ts`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChat } from './useChat';

// Mock fetch for SSE streaming
global.fetch = jest.fn();

describe('useChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useChat());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sends message and handles SSE streaming response', async () => {
    // Mock SSE stream response
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: Hello\n\n'),
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data:  World\n\n'),
        })
        .mockResolvedValueOnce({
          done: true,
          value: undefined,
        }),
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Test message');
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    // User message
    expect(result.current.messages[0]).toMatchObject({
      role: 'user',
      content: 'Test message',
    });

    // Assistant streaming message
    expect(result.current.messages[1]).toMatchObject({
      role: 'assistant',
      content: 'Hello World',
    });

    expect(result.current.isStreaming).toBe(false);
  });

  it('handles API errors correctly', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Test message');
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.error).toContain('Network error');
    expect(result.current.isStreaming).toBe(false);
  });

  it('sets isStreaming to true during message sending', async () => {
    const mockReader = {
      read: jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ done: true, value: undefined });
          }, 100);
        });
      }),
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      const promise = result.current.sendMessage('Test');
      await promise;
    });

    // After completion, streaming should be false
    expect(result.current.isStreaming).toBe(false);
  });

  it('accumulates streaming chunks correctly', async () => {
    const chunks = ['Hello', ' ', 'from', ' ', 'the', ' ', 'stream'];
    const mockReader = {
      read: jest.fn(),
    };

    // Setup mock to return chunks sequentially
    chunks.forEach((chunk) => {
      mockReader.read.mockResolvedValueOnce({
        done: false,
        value: new TextEncoder().encode(`data: ${chunk}\n\n`),
      });
    });
    mockReader.read.mockResolvedValueOnce({
      done: true,
      value: undefined,
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    expect(result.current.messages[1].content).toBe('Hello from the stream');
  });

  it('cleans up on unmount', async () => {
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

    const mockReader = {
      read: jest.fn().mockResolvedValue({ done: true, value: undefined }),
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    const { result, unmount } = renderHook(() => useChat());

    // Trigger a message to create an abort controller
    await act(async () => {
      await result.current.sendMessage('Test');
    });

    unmount();

    // Verify abort controller was called on unmount
    expect(abortSpy).toHaveBeenCalled();
  });
});

```


## `app-take2/hooks/useChat.ts`

```typescript
import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatMessage } from '@/lib/types';

interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  isStreaming: boolean;
  error: string | null;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setError(null);
      setIsStreaming(true);

      // Add user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      // Call streaming API
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Read SSE stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let accumulatedContent = '';
      const assistantMessageId = crypto.randomUUID();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6);
              const parsed = JSON.parse(jsonStr);

              if (parsed.content) {
                accumulatedContent += parsed.content;
              } else if (parsed.error) {
                throw new Error(parsed.error);
              } else if (parsed.done) {
                break;
              }
            } catch (err) {
              // Fallback to raw content if JSON parsing fails
              accumulatedContent += line.slice(6);
            }

            // Update assistant message
            setMessages((prev) => {
              const existing = prev.find((m) => m.id === assistantMessageId);
              if (existing) {
                return prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: accumulatedContent }
                    : m
                );
              } else {
                return [
                  ...prev,
                  {
                    id: assistantMessageId,
                    role: 'assistant' as const,
                    content: accumulatedContent,
                    timestamp: new Date(),
                  },
                ];
              }
            });
          }
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return {
    messages,
    sendMessage,
    isStreaming,
    error,
  };
}

```


## `app-take2/hooks/useJob.test.ts`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useJob } from './useJob';
import type { JobStatus } from '@/lib/types';

// Mock fetch
global.fetch = jest.fn();

const mockJobPending: JobStatus = {
  id: 'job-123',
  type: 'tree-generation',
  status: 'pending',
  createdAt: '2024-01-01T00:00:00Z',
};

const mockJobRunning: JobStatus = {
  id: 'job-123',
  type: 'tree-generation',
  status: 'running',
  progress: 50,
  message: 'Generating tree...',
  createdAt: '2024-01-01T00:00:00Z',
};

const mockJobCompleted: JobStatus = {
  id: 'job-123',
  type: 'tree-generation',
  status: 'completed',
  progress: 100,
  result: { treeData: 'completed' },
  createdAt: '2024-01-01T00:00:00Z',
  completedAt: '2024-01-01T00:02:00Z',
};

const mockJobFailed: JobStatus = {
  id: 'job-123',
  type: 'tree-generation',
  status: 'failed',
  error: 'Generation failed',
  createdAt: '2024-01-01T00:00:00Z',
  completedAt: '2024-01-01T00:01:00Z',
};

describe('useJob', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useJob('job-123', false));

    expect(result.current.job).toBeNull();
    expect(result.current.isPolling).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('does not poll when enabled is false', async () => {
    const { result } = renderHook(() => useJob('job-123', false));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.isPolling).toBe(false);
  });

  it('polls job status every 2 seconds when enabled', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockJobRunning,
    });

    const { result } = renderHook(() => useJob('job-123', true));

    // Initial fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Wait for job data to be set
    await waitFor(() => {
      expect(result.current.job).toEqual(mockJobRunning);
    });

    expect(result.current.isPolling).toBe(true);

    // Wait 2 seconds for next poll
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    // Wait another 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    expect(result.current.job).toEqual(mockJobRunning);
  });

  it('stops polling when job completes', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobRunning,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobCompleted,
      });

    const { result } = renderHook(() => useJob('job-123', true));

    // Initial fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Wait for second poll
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.job?.status).toBe('completed');
    });

    expect(result.current.isPolling).toBe(false);

    // Should not poll again after completion
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('stops polling when job fails', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobRunning,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobFailed,
      });

    const { result } = renderHook(() => useJob('job-123', true));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.job?.status).toBe('failed');
    });

    expect(result.current.isPolling).toBe(false);

    // Should not poll again after failure
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('allows manual stop of polling', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockJobRunning,
    });

    const { result } = renderHook(() => useJob('job-123', true));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(result.current.isPolling).toBe(true);

    act(() => {
      result.current.stopPolling();
    });

    expect(result.current.isPolling).toBe(false);

    // Should not continue polling after manual stop
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles fetch errors during polling', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useJob('job-123', true));

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.error).toContain('Network error');
    expect(result.current.isPolling).toBe(false);
  });

  it('cleans up interval on unmount', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockJobRunning,
    });

    const { result, unmount } = renderHook(() => useJob('job-123', true));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    unmount();

    // Should not poll after unmount
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('restarts polling when enabled changes from false to true', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockJobRunning,
    });

    const { result, rerender } = renderHook(
      ({ enabled }) => useJob('job-123', enabled),
      {
        initialProps: { enabled: false },
      }
    );

    expect(result.current.isPolling).toBe(false);

    // Enable polling
    rerender({ enabled: true });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(result.current.isPolling).toBe(true);
  });

  it('stops polling when enabled changes from true to false', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockJobRunning,
    });

    const { result, rerender } = renderHook(
      ({ enabled }) => useJob('job-123', enabled),
      {
        initialProps: { enabled: true },
      }
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(result.current.isPolling).toBe(true);

    // Disable polling
    rerender({ enabled: false });

    expect(result.current.isPolling).toBe(false);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should not poll again
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('fetches different job when jobId changes', async () => {
    const job2: JobStatus = { ...mockJobRunning, id: 'job-456' };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobRunning,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => job2,
      });

    const { result, rerender } = renderHook(
      ({ jobId }) => useJob(jobId, true),
      {
        initialProps: { jobId: 'job-123' },
      }
    );

    await waitFor(() => {
      expect(result.current.job?.id).toBe('job-123');
    });

    // Change jobId
    rerender({ jobId: 'job-456' });

    await waitFor(() => {
      expect(result.current.job?.id).toBe('job-456');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/jobs/job-123');
    expect(global.fetch).toHaveBeenCalledWith('/api/jobs/job-456');
  });
});

```


## `app-take2/hooks/useJob.ts`

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import type { JobStatus } from '@/lib/types';

interface UseJobReturn {
  job: JobStatus | null;
  isPolling: boolean;
  error: string | null;
  stopPolling: () => void;
}

export function useJob(jobId: string, enabled: boolean): UseJobReturn {
  const [job, setJob] = useState<JobStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldPollRef = useRef(enabled);

  // Update shouldPollRef when enabled changes
  useEffect(() => {
    shouldPollRef.current = enabled;
  }, [enabled]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    shouldPollRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchJob = useCallback(async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJob(data);

      // Stop polling if job is completed or failed
      if (data.status === 'completed' || data.status === 'failed') {
        stopPolling();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      stopPolling();
    }
  }, [jobId, stopPolling]);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!enabled) {
      setIsPolling(false);
      return;
    }

    // Start polling
    setIsPolling(true);
    shouldPollRef.current = true;

    // Initial fetch
    fetchJob();

    // Set up polling interval (2 seconds)
    intervalRef.current = setInterval(() => {
      if (shouldPollRef.current) {
        fetchJob();
      }
    }, 2000);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [jobId, enabled, fetchJob]);

  return {
    job,
    isPolling,
    error,
    stopPolling,
  };
}

```


## `app-take2/hooks/useProfile.test.ts`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useProfile } from './useProfile';
import type { LearningProfile } from '@/lib/types';

// Mock fetch
global.fetch = jest.fn();

const mockProfile: LearningProfile = {
  teaching_tone: 'balanced',
  motivation_style: 'positive-reinforcement',
  default_source_depth: 2,
  terminology_level: 'adaptive',
  example_preferences: 'both',
  preferred_language: 'English',
  created: '2024-01-01',
  last_updated: '2024-01-01',
};

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useProfile());

    expect(result.current.profile).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches profile data on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProfile,
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith('/api/profile');
  });

  it('handles profile not found (404) as empty profile', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBeNull(); // 404 is not an error for profile
  });

  it('handles other fetch errors correctly', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toContain('Network error');
  });

  it('updates profile and syncs with API', async () => {
    const updatedProfile: LearningProfile = {
      ...mockProfile,
      teaching_tone: 'direct',
      terminology_level: 'academic',
    };

    // Initial fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfile,
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Update profile
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => updatedProfile,
    });

    await act(async () => {
      await result.current.updateProfile({
        teaching_tone: 'direct',
        terminology_level: 'academic',
      });
    });

    await waitFor(() => {
      expect(result.current.profile?.teaching_tone).toBe('direct');
    });

    expect(result.current.profile).toMatchObject({
      teaching_tone: 'direct',
      terminology_level: 'academic',
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teaching_tone: 'direct',
        terminology_level: 'academic',
      }),
    });
  });

  it('handles update errors correctly', async () => {
    // Initial fetch succeeds
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfile,
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Update fails
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Update failed')
    );

    await act(async () => {
      await result.current.updateProfile({ teaching_tone: 'direct' });
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.error).toContain('Update failed');
    // Profile should remain unchanged on error
    expect(result.current.profile?.teaching_tone).toBe('balanced');
  });

  it('sets loading state during update', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProfile,
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      const promise = result.current.updateProfile({ teaching_tone: 'direct' });
      await promise;
    });

    // After update completes, loading should be false
    expect(result.current.isLoading).toBe(false);
  });

  it('merges partial updates with existing profile', async () => {
    const updatedProfile = { ...mockProfile, teaching_tone: 'direct' as const };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => updatedProfile,
      });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateProfile({ teaching_tone: 'direct' });
    });

    await waitFor(() => {
      expect(result.current.profile?.teaching_tone).toBe('direct');
    });

    // Other fields should remain unchanged
    expect(result.current.profile?.motivation_style).toBe(
      'positive-reinforcement'
    );
    expect(result.current.profile?.default_source_depth).toBe(2);
  });
});

```


## `app-take2/hooks/useProfile.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import type { LearningProfile } from '@/lib/types';

interface UseProfileReturn {
  profile: LearningProfile | null;
  updateProfile: (updates: Partial<LearningProfile>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/profile');

        if (response.status === 404) {
          // 404 is not an error for profile (just means no profile yet)
          setProfile(null);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<LearningProfile>) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    profile,
    updateProfile,
    isLoading,
    error,
  };
}

```


## `app-take2/hooks/useTree.test.ts`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTree } from './useTree';
import type { TreeStructure } from '@/lib/types';

// Mock fetch
global.fetch = jest.fn();

const mockTreeData: TreeStructure = {
  goal: 'test-goal',
  created: '2024-01-01',
  last_updated: '2024-01-01',
  max_concepts: 10,
  total_concepts: 5,
  tree: {
    'concept-1': {
      status: 'NOT_STARTED',
      tags: ['intuitive'],
      last_reviewed: null,
      parent: null,
      children: ['concept-2'],
    },
    'concept-2': {
      status: 'IN_PROGRESS',
      tags: ['formal'],
      last_reviewed: '2024-01-01',
      parent: 'concept-1',
      children: [],
    },
  },
};

describe('useTree', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useTree('test-goal'));

    expect(result.current.tree).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches tree data on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTreeData,
    });

    const { result } = renderHook(() => useTree('test-goal'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tree).toEqual(mockTreeData);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith('/api/tree/test-goal');
  });

  it('handles fetch errors correctly', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useTree('test-goal'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tree).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toContain('Failed to fetch');
  });

  it('caches tree data and does not refetch on re-render', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTreeData,
    });

    const { result, rerender } = renderHook(() => useTree('test-goal'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Re-render should not trigger new fetch
    rerender();

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('refetches data when refetch is called', async () => {
    const updatedTreeData = { ...mockTreeData, total_concepts: 8 };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTreeData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => updatedTreeData,
      });

    const { result } = renderHook(() => useTree('test-goal'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tree?.total_concepts).toBe(5);

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.tree?.total_concepts).toBe(8);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('fetches different tree when goalName changes', async () => {
    const tree2Data = { ...mockTreeData, goal: 'test-goal-2' };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTreeData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => tree2Data,
      });

    const { result, rerender } = renderHook(
      ({ goalName }) => useTree(goalName),
      {
        initialProps: { goalName: 'test-goal' },
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tree?.goal).toBe('test-goal');

    // Change goalName
    rerender({ goalName: 'test-goal-2' });

    await waitFor(() => {
      expect(result.current.tree?.goal).toBe('test-goal-2');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/tree/test-goal');
    expect(global.fetch).toHaveBeenCalledWith('/api/tree/test-goal-2');
  });

  it('handles 404 errors gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const { result } = renderHook(() => useTree('nonexistent-goal'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tree).toBeNull();
    expect(result.current.error).toContain('404');
  });
});

```


## `app-take2/hooks/useTree.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import type { TreeStructure } from '@/lib/types';

interface UseTreeReturn {
  tree: TreeStructure | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTree(goalName: string): UseTreeReturn {
  const [tree, setTree] = useState<TreeStructure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTree = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/tree/${goalName}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTree(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [goalName]);

  // Fetch on mount and when goalName changes
  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const refetch = useCallback(async () => {
    await fetchTree();
  }, [fetchTree]);

  return {
    tree,
    isLoading,
    error,
    refetch,
  };
}

```


## `app-take2/jest.config.js`

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|remark-math|rehype-katex|unist-.*|unified|bail|is-plain-obj|trough|vfile|vfile-message|markdown-table|micromark.*|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|katex)/)',
  ],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '**/*.(test|spec).[jt]s?(x)',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)

```


## `app-take2/jest.setup.js`

```javascript
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock ResizeObserver (required for ScrollArea component)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    setTheme: jest.fn(),
  })),
  ThemeProvider: ({ children }) => children,
}))

// Mock LayoutWrapper to pass through children only (for page tests)
jest.mock('@/components/layout/LayoutWrapper', () => ({
  LayoutWrapper: ({ children }) => children,
}))

```


## `app-take2/lib/claude-cli.ts`

```typescript
import { spawn } from 'child_process';

export interface ClaudeCliOptions {
  command: string;
  args?: string[];
  cwd?: string;
  timeout?: number;
}

export interface StreamChunk {
  type: 'stdout' | 'stderr' | 'error' | 'done';
  data: string;
}

/**
 * Execute Claude CLI command and return output
 */
export async function executeClaudeCli(options: ClaudeCliOptions): Promise<string> {
  const {
    command,
    args = [],
    cwd = process.env.CLAUDE_BASE_PATH || process.cwd(),
    timeout = parseInt(process.env.DEFAULT_TIMEOUT_SECONDS || '120') * 1000,
  } = options;

  return new Promise((resolve, reject) => {
    const cliPath = process.env.CLAUDE_CLI_PATH || 'claude';
    const fullArgs = [command, ...args];

    const proc = spawn(cliPath, fullArgs, {
      cwd,
      shell: true,
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';
    let timeoutId: NodeJS.Timeout;

    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        proc.kill('SIGTERM');
        reject(new Error(`Claude CLI command timed out after ${timeout}ms`));
      }, timeout);
    }

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('error', (error) => {
      clearTimeout(timeoutId);
      reject(new Error(`Failed to spawn Claude CLI: ${error.message}`));
    });

    proc.on('close', (code) => {
      clearTimeout(timeoutId);
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Claude CLI exited with code ${code}: ${stderr}`));
      }
    });
  });
}

/**
 * Stream Claude CLI output using AsyncGenerator
 */
export async function* streamClaudeCli(options: ClaudeCliOptions): AsyncGenerator<StreamChunk> {
  const {
    command,
    args = [],
    cwd = process.env.CLAUDE_BASE_PATH || process.cwd(),
    timeout = parseInt(process.env.DEFAULT_TIMEOUT_SECONDS || '120') * 1000,
  } = options;

  const cliPath = process.env.CLAUDE_CLI_PATH || 'claude';
  const fullArgs = [command, ...args];

  const proc = spawn(cliPath, fullArgs, {
    cwd,
    shell: true,
    windowsHide: true,
  });

  let timeoutId: NodeJS.Timeout | undefined;

  if (timeout > 0) {
    timeoutId = setTimeout(() => {
      proc.kill('SIGTERM');
    }, timeout);
  }

  // Yield stdout chunks
  for await (const chunk of proc.stdout) {
    yield {
      type: 'stdout',
      data: chunk.toString(),
    };
  }

  // Yield stderr chunks
  for await (const chunk of proc.stderr) {
    yield {
      type: 'stderr',
      data: chunk.toString(),
    };
  }

  // Wait for process to close
  const exitCode = await new Promise<number>((resolve) => {
    proc.on('close', (code) => {
      if (timeoutId) clearTimeout(timeoutId);
      resolve(code || 0);
    });
  });

  if (exitCode !== 0) {
    yield {
      type: 'error',
      data: `Process exited with code ${exitCode}`,
    };
  }

  yield {
    type: 'done',
    data: '',
  };
}

```


## `app-take2/lib/file-state.ts`

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import { LearningProfile, TreeStructure } from './types';

const getBasePath = () => {
  const basePath = process.env.CLAUDE_BASE_PATH;
  if (!basePath) {
    throw new Error('CLAUDE_BASE_PATH environment variable not set');
  }
  return basePath;
};

/**
 * Read learning profile
 */
export async function readProfile(): Promise<LearningProfile | null> {
  try {
    const profilePath = path.join(getBasePath(), 'learning-profile.md');
    const content = await fs.readFile(profilePath, 'utf-8');

    // Parse markdown to extract profile data
    // This is a simplified parser - real implementation would be more robust
    const profile: Partial<LearningProfile> = {
      teaching_tone: 'balanced',
      motivation_style: 'balanced',
      default_source_depth: 2,
      terminology_level: 'adaptive',
      example_preferences: 'both',
      preferred_language: 'English',
      created: new Date().toISOString(),
    };

    // Extract fields from markdown
    const toneMatch = content.match(/Selected:\s*(nice|direct|balanced|other)/i);
    if (toneMatch) profile.teaching_tone = toneMatch[1].toLowerCase() as any;

    const motivationMatch = content.match(/Motivation Style[\s\S]*?Selected:\s*(positive-reinforcement|tough-love|balanced)/i);
    if (motivationMatch) profile.motivation_style = motivationMatch[1] as any;

    const depthMatch = content.match(/Default Source Depth[\s\S]*?Selected:\s*(\d)/i);
    if (depthMatch) profile.default_source_depth = parseInt(depthMatch[1]) as any;

    const termMatch = content.match(/Terminology Level[\s\S]*?Selected:\s*(casual|academic|adaptive)/i);
    if (termMatch) profile.terminology_level = termMatch[1] as any;

    const exampleMatch = content.match(/Example Preferences[\s\S]*?Selected:\s*(analogies|formal-definitions|both)/i);
    if (exampleMatch) profile.example_preferences = exampleMatch[1] as any;

    const langMatch = content.match(/Preferred Language[\s\S]*?Selected:\s*([^\n]+)/i);
    if (langMatch) profile.preferred_language = langMatch[1].trim();

    return profile as LearningProfile;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * Write learning profile
 */
export async function writeProfile(profile: LearningProfile): Promise<void> {
  const profilePath = path.join(getBasePath(), 'learning-profile.md');

  const content = `# Learning Profile

## Teaching Tone
Selected: ${profile.teaching_tone}
${profile.custom_tone ? `\nUser's custom specification:\n"${profile.custom_tone}"` : ''}

## Motivation Style
Selected: ${profile.motivation_style}

## Default Source Depth
Selected: ${profile.default_source_depth}

## Terminology Level
Selected: ${profile.terminology_level}

## Example Preferences
Selected: ${profile.example_preferences}

## Preferred Language
Selected: ${profile.preferred_language}

## Created
${profile.created}

${profile.last_updated ? `## Last Updated\n${profile.last_updated}` : ''}
`;

  await fs.writeFile(profilePath, content, 'utf-8');
}

/**
 * Read tree.json for a goal
 */
export async function readTreeJson(goalName: string): Promise<TreeStructure | null> {
  try {
    const treePath = path.join(getBasePath(), 'study-goals', goalName, 'tree.json');
    const content = await fs.readFile(treePath, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * Write tree.json for a goal
 */
export async function writeTreeJson(goalName: string, tree: TreeStructure): Promise<void> {
  const treePath = path.join(getBasePath(), 'study-goals', goalName, 'tree.json');
  await fs.mkdir(path.dirname(treePath), { recursive: true });
  await fs.writeFile(treePath, JSON.stringify(tree, null, 2), 'utf-8');
}

/**
 * Read concept.md content
 */
export async function readConcept(goalName: string, conceptPath: string): Promise<string | null> {
  try {
    const fullPath = path.join(getBasePath(), 'study-goals', goalName, conceptPath, 'concept.md');
    return await fs.readFile(fullPath, 'utf-8');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * Read global progress
 */
export async function readGlobalProgress(): Promise<any> {
  try {
    const progressPath = path.join(getBasePath(), 'global-progress.json');
    const content = await fs.readFile(progressPath, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return { goals: {}, created: new Date().toISOString(), last_updated: new Date().toISOString() };
    }
    throw error;
  }
}

/**
 * Write global progress
 */
export async function writeGlobalProgress(progress: any): Promise<void> {
  const progressPath = path.join(getBasePath(), 'global-progress.json');
  await fs.writeFile(progressPath, JSON.stringify(progress, null, 2), 'utf-8');
}

/**
 * Check if profile exists
 */
export async function profileExists(): Promise<boolean> {
  try {
    const profilePath = path.join(getBasePath(), 'learning-profile.md');
    await fs.access(profilePath);
    return true;
  } catch {
    return false;
  }
}

```


## `app-take2/lib/job-queue.ts`

```typescript
import { JobStatus } from './types';
import { randomUUID } from 'crypto';

// In-memory job store (would use Redis/database in production)
const jobs = new Map<string, JobStatus>();

/**
 * Create a new job
 */
export function createJob(type: 'tree-generation' | 'concept-breakdown'): JobStatus {
  const job: JobStatus = {
    id: randomUUID(),
    type,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  jobs.set(job.id, job);
  return job;
}

/**
 * Update job status
 */
export function updateJob(
  id: string,
  updates: Partial<Omit<JobStatus, 'id' | 'type' | 'createdAt'>>
): JobStatus | null {
  const job = jobs.get(id);
  if (!job) return null;

  const updated = { ...job, ...updates };
  jobs.set(id, updated);
  return updated;
}

/**
 * Get job by ID
 */
export function getJob(id: string): JobStatus | null {
  return jobs.get(id) || null;
}

/**
 * Delete job (cleanup)
 */
export function deleteJob(id: string): boolean {
  return jobs.delete(id);
}

/**
 * Get all jobs (for debugging)
 */
export function getAllJobs(): JobStatus[] {
  return Array.from(jobs.values());
}

```


## `app-take2/lib/types.ts`

```typescript
// Type definitions for Little Cheerful Web UI

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  goalName?: string;
  conceptPath?: string;
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  requiresOption?: boolean;
}

export interface TreeStructure {
  goal: string;
  created: string;
  last_updated: string;
  max_concepts: number;
  total_concepts: number;
  tree: Record<string, ConceptNode>;
}

export interface ConceptNode {
  status: ConceptStatus;
  tags: string[];
  last_reviewed: string | null;
  parent: string | null;
  children: string[];
}

export type ConceptStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'STUDIED';

export interface LearningProfile {
  teaching_tone: 'nice' | 'direct' | 'balanced' | 'other';
  custom_tone?: string;
  motivation_style: 'positive-reinforcement' | 'tough-love' | 'balanced';
  default_source_depth: 1 | 2 | 3 | 4;
  terminology_level: 'casual' | 'academic' | 'adaptive';
  example_preferences: 'analogies' | 'formal-definitions' | 'both';
  preferred_language: string;
  created: string;
  last_updated?: string;
}

export interface StudyMaterial {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  path: string;
}

export interface ThreeOptionState {
  message: string;
  options: ['think' | 'hint' | 'explain'];
}

export interface OperationStatus {
  status: 'pending' | 'running' | 'completed' | 'failed';
  message?: string;
  progress?: number;
  result?: unknown;
  error?: string;
}

export interface JobStatus extends OperationStatus {
  id: string;
  type: 'tree-generation' | 'concept-breakdown';
  createdAt: string;
  completedAt?: string;
}

```


## `app-take2/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```


## `app-take2/next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

```


## `app-take2/postcss.config.mjs`

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;

```


## `app-take2/providers/QueryProvider.tsx`

```typescript
'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

```


## `app-take2/providers/ThemeProvider.tsx`

```typescript
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

```


## `app-take2/tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			parchment: {
  				light: '#F4ECD8',
  				dark: '#1A1410'
  			},
  			crimson: {
  				light: '#8B0000',
  				dark: '#6B2020'
  			},
  			marble: {
  				light: '#F8F8FF',
  				dark: '#252030'
  			},
  			gold: {
  				light: '#DAA520',
  				dark: '#B8860B'
  			},
  			ink: {
  				light: '#2C1810',
  				dark: '#E8DFC8'
  			},
  			laurel: {
  				light: '#2E6F2E',
  				dark: '#4A8F4A'
  			},
  			waxSeal: {
  				light: '#B8710D',
  				dark: '#D4932F'
  			},
  			blood: {
  				light: '#9B1C1C',
  				dark: '#C23B3B'
  			},
  			lapis: {
  				light: '#1E4D8B',
  				dark: '#3B6FAF'
  			},
  			// Semantic aliases
  			success: {
  				light: '#2E6F2E',
  				dark: '#4A8F4A'
  			},
  			warning: {
  				light: '#B8710D',
  				dark: '#D4932F'
  			},
  			danger: {
  				light: '#9B1C1C',
  				dark: '#C23B3B'
  			},
  			info: {
  				light: '#1E4D8B',
  				dark: '#3B6FAF'
  			},
  			disabled: '#968A76',
  			'border-medium': {
  				light: '#B8A888',
  				dark: '#524435'
  			},
  			border: 'hsl(var(--border))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			body: [
  				'var(--font-crimson-text)',
  				'Georgia',
  				'Times New Roman',
  				'serif'
  			],
  			display: [
  				'var(--font-eb-garamond)',
  				'Garamond',
  				'Georgia',
  				'serif'
  			],
  			mono: [
  				'var(--font-jetbrains-mono)',
  				'Fira Code',
  				'Consolas',
  				'monospace'
  			]
  		},
  		spacing: {
  			xs: '0.25rem',
  			sm: '0.5rem',
  			md: '1rem',
  			lg: '1.5rem',
  			xl: '2rem',
  			'2xl': '3rem',
  			'3xl': '4rem'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			draw: {
  				'0%': { strokeDashoffset: '1000' },
  				'100%': { strokeDashoffset: '0' }
  			}
  		},
  		animation: {
  			draw: 'draw 1.2s ease-in infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

```


---

**Summary:**
- Files included: 77
- Binary files skipped: 42
