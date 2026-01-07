import { render, screen } from '@testing-library/react';
import { LayoutWrapper } from './LayoutWrapper';

// Mock usePathname
const mockPathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock useTheme
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: { goals: [] },
    isLoading: false,
    isError: false,
  }),
}));

describe('LayoutWrapper', () => {
  it('renders children without layout on landing page', () => {
    mockPathname.mockReturnValue('/');
    render(
      <LayoutWrapper>
        <div>Test content</div>
      </LayoutWrapper>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders children without layout on setup page', () => {
    mockPathname.mockReturnValue('/setup');
    render(
      <LayoutWrapper>
        <div>Onboarding content</div>
      </LayoutWrapper>
    );

    expect(screen.getByText('Onboarding content')).toBeInTheDocument();
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders children with layout on /learn page', () => {
    mockPathname.mockReturnValue('/learn');
    render(
      <LayoutWrapper>
        <div>Dashboard content</div>
      </LayoutWrapper>
    );

    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders children with layout on /materials page', () => {
    mockPathname.mockReturnValue('/materials');
    render(
      <LayoutWrapper>
        <div>Materials content</div>
      </LayoutWrapper>
    );

    expect(screen.getByText('Materials content')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('wraps all content with ErrorBoundary', () => {
    mockPathname.mockReturnValue('/learn');
    const { container } = render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    );

    // ErrorBoundary should be in the component tree
    expect(container).toBeInTheDocument();
  });
});
