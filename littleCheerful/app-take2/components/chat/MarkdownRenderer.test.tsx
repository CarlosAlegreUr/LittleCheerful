import { render, screen } from '@testing-library/react';
import { MarkdownRenderer } from './MarkdownRenderer';

describe('MarkdownRenderer', () => {
  it('renders without crashing', () => {
    render(<MarkdownRenderer content="Plain text" />);
    expect(screen.getByText('Plain text')).toBeInTheDocument();
  });

  it('renders markdown headings correctly', () => {
    render(<MarkdownRenderer content="# Heading 1\n## Heading 2" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2');
  });

  it('renders markdown bold text', () => {
    const { container } = render(<MarkdownRenderer content="**bold text**" />);

    const strong = container.querySelector('strong');
    expect(strong).toHaveTextContent('bold text');
  });

  it('renders markdown italic text', () => {
    const { container } = render(<MarkdownRenderer content="_italic text_" />);

    const em = container.querySelector('em');
    expect(em).toHaveTextContent('italic text');
  });

  it('renders markdown code blocks', () => {
    const { container } = render(
      <MarkdownRenderer content="```javascript\nconst x = 1;\n```" />
    );

    const code = container.querySelector('code');
    expect(code).toHaveTextContent('const x = 1;');
  });

  it('renders inline code', () => {
    const { container } = render(<MarkdownRenderer content="`inline code`" />);

    const code = container.querySelector('code');
    expect(code).toHaveTextContent('inline code');
  });

  it('renders markdown lists', () => {
    const { container } = render(
      <MarkdownRenderer content="- Item 1\n- Item 2\n- Item 3" />
    );

    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveTextContent('Item 1');
  });

  it('renders KaTeX math inline', () => {
    const { container } = render(
      <MarkdownRenderer content="Equation: $E = mc^2$" />
    );

    // KaTeX renders math with specific class
    const math = container.querySelector('.katex');
    expect(math).toBeInTheDocument();
  });

  it('renders KaTeX math block', () => {
    const { container } = render(
      <MarkdownRenderer content="$$\n\\int_0^\\infty e^{-x^2} dx\n$$" />
    );

    // KaTeX block should be present
    const mathBlock = container.querySelector('.katex-display');
    expect(mathBlock).toBeInTheDocument();
  });

  it('applies Roman theme typography', () => {
    const { container } = render(<MarkdownRenderer content="# Heading\nBody text" />);

    // Body text should use Crimson Text
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('font-crimson');

    // Headings should use EB Garamond
    const heading = container.querySelector('h1');
    expect(heading).toHaveClass('font-garamond');
  });

  it('applies proper text color', () => {
    const { container } = render(<MarkdownRenderer content="Text" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('text-ink-light');
    expect(wrapper).toHaveClass('dark:text-ink-dark');
  });

  it('renders links correctly', () => {
    render(<MarkdownRenderer content="[Link text](https://example.com)" />);

    const link = screen.getByRole('link', { name: 'Link text' });
    expect(link).toHaveAttribute('href', 'https://example.com');
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
