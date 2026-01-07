import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/learn',
}));

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: {
      goals: [
        { name: 'Goal 1', description: 'Test goal 1' },
        { name: 'Goal 2', description: 'Test goal 2' },
      ],
    },
    isLoading: false,
    isError: false,
  }),
}));

describe('Sidebar', () => {
  it('renders without crashing', () => {
    render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders Dashboard navigation link', () => {
    render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders Materials navigation link', () => {
    render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText('Materials')).toBeInTheDocument();
  });

  it('renders current goals list', () => {
    render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText('Goal 1')).toBeInTheDocument();
    expect(screen.getByText('Goal 2')).toBeInTheDocument();
  });

  it('uses ParchmentCard for styling', () => {
    const { container } = render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    // ParchmentCard has bg-parchment-light class
    expect(container.querySelector('.bg-parchment-light')).toBeInTheDocument();
  });

  it('is hidden when isOpen is false on mobile', () => {
    const { container } = render(<Sidebar isOpen={false} onClose={jest.fn()} />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('hidden');
  });

  it('is visible when isOpen is true', () => {
    const { container } = render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    const nav = container.querySelector('nav');
    expect(nav).not.toHaveClass('hidden');
  });
});
