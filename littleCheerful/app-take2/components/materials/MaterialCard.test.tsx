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
