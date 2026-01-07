'use client';

import * as React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-2xl text-center relative">
            {/* InkBlot effect */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-ink-light dark:bg-ink-dark opacity-10 blur-xl rounded-full animate-pulse" />
              <h1 className="relative text-4xl font-display font-semibold mb-4 text-ink-light dark:text-ink-dark">
                Something went wrong
              </h1>
            </div>
            <p className="text-lg mb-6 text-ink-light/70 dark:text-ink-dark/70">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gold-light dark:bg-gold-dark text-ink-light dark:text-ink-dark rounded-lg hover:opacity-90 transition-opacity"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
