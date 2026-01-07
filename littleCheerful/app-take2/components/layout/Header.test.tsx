import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

// Mock useTheme
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

describe('Header', () => {
  const renderHeader = (showSidebar = false) => {
    return render(<Header showSidebar={showSidebar} />);
  };

  it('renders without crashing', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders app title with OrnateHeading', () => {
    renderHeader();
    expect(screen.getByText('Little Cheerful')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    renderHeader();
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  it('toggles theme when button clicked', () => {
    const setTheme = jest.fn();
    jest.spyOn(require('next-themes'), 'useTheme').mockReturnValue({
      theme: 'light',
      setTheme,
    });

    renderHeader();
    const toggleButton = screen.getByLabelText('Toggle theme');
    fireEvent.click(toggleButton);

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('has sticky position at top', () => {
    const { container } = renderHeader();
    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky');
    expect(header).toHaveClass('top-0');
  });

  it('displays menu button when showSidebar is true', () => {
    renderHeader(true);
    expect(screen.getByLabelText('Toggle sidebar')).toBeInTheDocument();
  });

  it('does not display menu button when showSidebar is false', () => {
    renderHeader(false);
    expect(screen.queryByLabelText('Toggle sidebar')).not.toBeInTheDocument();
  });
});
