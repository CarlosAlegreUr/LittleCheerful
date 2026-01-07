import type { Metadata } from 'next';
import { crimsonText, ebGaramond, jetbrainsMono } from './fonts';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'Little Cheerful - AI Learning Companion',
  description: 'Your personal Socratic learning guide with Roman Library aesthetics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${crimsonText.variable} ${ebGaramond.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ErrorBoundary>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ErrorBoundary>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
