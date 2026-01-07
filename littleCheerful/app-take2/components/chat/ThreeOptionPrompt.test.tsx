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
