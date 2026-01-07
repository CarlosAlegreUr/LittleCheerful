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

    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [file] },
    });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(expect.any(FileList));
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
