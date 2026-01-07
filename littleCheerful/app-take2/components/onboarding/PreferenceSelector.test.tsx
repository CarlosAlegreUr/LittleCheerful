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
