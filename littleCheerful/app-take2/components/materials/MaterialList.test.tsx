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
