import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MaterialsPage from './page';

// Mock fetch
global.fetch = jest.fn();

describe('MaterialsPage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render materials page heading', () => {
    render(<MaterialsPage />);
    expect(screen.getByText(/study materials/i)).toBeInTheDocument();
  });

  it('should fetch and display existing materials on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        materials: [
          {
            id: '1',
            name: 'JavaScript Notes.pdf',
            type: 'application/pdf',
            size: 1024000,
            uploadedAt: new Date().toISOString(),
            path: '/materials/js-notes.pdf',
          },
          {
            id: '2',
            name: 'React Cheatsheet.txt',
            type: 'text/plain',
            size: 5120,
            uploadedAt: new Date().toISOString(),
            path: '/materials/react-cheat.txt',
          },
        ],
      }),
    });

    render(<MaterialsPage />);

    await waitFor(() => {
      expect(screen.getByText(/JavaScript Notes\.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/React Cheatsheet\.txt/i)).toBeInTheDocument();
    });
  });

  it('should have upload zone component', () => {
    render(<MaterialsPage />);
    expect(screen.getByTestId('upload-zone')).toBeInTheDocument();
  });

  it('should POST file to /api/materials on upload', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: '3',
        name: 'test.pdf',
        type: 'application/pdf',
        size: 2048,
        uploadedAt: new Date().toISOString(),
        path: '/materials/test.pdf',
      }),
    });

    render(<MaterialsPage />);

    const uploadZone = screen.getByTestId('upload-zone');
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

    // Simulate drag and drop
    fireEvent.drop(uploadZone, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/materials',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('should add uploaded file to materials list', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ materials: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '3',
          name: 'new-file.pdf',
          type: 'application/pdf',
          size: 2048,
          uploadedAt: new Date().toISOString(),
          path: '/materials/new-file.pdf',
        }),
      });

    render(<MaterialsPage />);

    const uploadZone = screen.getByTestId('upload-zone');
    const file = new File(['content'], 'new-file.pdf', {
      type: 'application/pdf',
    });

    fireEvent.drop(uploadZone, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/new-file\.pdf/i)).toBeInTheDocument();
    });
  });

  it('should DELETE file from /api/materials on delete', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          materials: [
            {
              id: '1',
              name: 'test.pdf',
              type: 'application/pdf',
              size: 2048,
              uploadedAt: new Date().toISOString(),
              path: '/materials/test.pdf',
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(<MaterialsPage />);

    await waitFor(() => {
      expect(screen.getByText(/test\.pdf/i)).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/materials',
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({ id: '1' }),
        })
      );
    });
  });

  it('should remove deleted file from materials list', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          materials: [
            {
              id: '1',
              name: 'test.pdf',
              type: 'application/pdf',
              size: 2048,
              uploadedAt: new Date().toISOString(),
              path: '/materials/test.pdf',
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(<MaterialsPage />);

    await waitFor(() => {
      expect(screen.getByText(/test\.pdf/i)).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText(/test\.pdf/i)).not.toBeInTheDocument();
    });
  });

  it('should show loading state during upload', async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ materials: [] }),
      })
      .mockReturnValueOnce(promise);

    render(<MaterialsPage />);

    const uploadZone = screen.getByTestId('upload-zone');
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.drop(uploadZone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(screen.getByTestId('quill-loader')).toBeInTheDocument();

    resolvePromise!({
      ok: true,
      json: async () => ({
        id: '1',
        name: 'test.pdf',
        type: 'application/pdf',
        size: 2048,
        uploadedAt: new Date().toISOString(),
        path: '/materials/test.pdf',
      }),
    });
  });

  it('should show error state on upload failure', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ materials: [] }),
      })
      .mockRejectedValueOnce(new Error('Upload failed'));

    render(<MaterialsPage />);

    const uploadZone = screen.getByTestId('upload-zone');
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.drop(uploadZone, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
