'use client';

import * as React from 'react';
import { OrnateHeading } from '@/components/roman/OrnateHeading';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({ showSidebar = false, onToggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className={cn(
        'sticky top-0 z-50',
        'bg-marble-light dark:bg-marble-dark',
        'texture-marble', // Marble veining texture
        'border-b border-border-medium',
        'px-4 py-3',
        'flex items-center justify-between'
      )}
      role="banner"
    >
      <div className="flex items-center gap-4">
        {showSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <OrnateHeading level={2} className="border-0 pb-0">
          Little Cheerful
        </OrnateHeading>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    </header>
  );
}
