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
