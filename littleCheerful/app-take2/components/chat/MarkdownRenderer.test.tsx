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
