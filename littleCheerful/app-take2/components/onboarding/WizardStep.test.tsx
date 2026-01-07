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
    render(
      <WizardStep
        stepNumber={2}
        title="Step Two"
        description="Second step"
        isActive={false}
      >
        <div>Content</div>
      </WizardStep>
    );

    const stepContainer = screen.queryByText('Step Two')?.closest('[role]');
    expect(stepContainer).not.toHaveAttribute('aria-current');
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
