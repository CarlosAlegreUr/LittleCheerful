'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ParchmentCard } from '@/components/roman/ParchmentCard';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Upload } from 'lucide-react';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GoalsResponse {
  goals: Array<{ name: string; description: string }>;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Fetch current goals
  const { data } = useQuery<GoalsResponse>({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await fetch('/api/learning/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      return response.json();
    },
  });

  const goals = data?.goals || [];

  const navItems = [
    { href: '/learn', label: 'Dashboard', icon: BookOpen },
    { href: '/materials', label: 'Materials', icon: Upload },
  ];

  return (
    <nav
      className={cn(
        'fixed md:static inset-y-0 left-0 z-40',
        'w-64 bg-parchment-light dark:bg-parchment-dark',
        'border-r border-border-medium',
        'flex flex-col',
        'transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        !isOpen && 'hidden md:flex'
      )}
      role="navigation"
    >
      <div className="p-4 space-y-4 overflow-y-auto">
        {/* Navigation Links */}
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg',
                  'transition-colors duration-200',
                  isActive
                    ? 'bg-gold-light/20 dark:bg-gold-dark/20 text-ink-light dark:text-ink-dark'
                    : 'hover:bg-parchment-dark/10 dark:hover:bg-parchment-light/10'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Current Goals */}
        {goals.length > 0 && (
          <ParchmentCard className="p-4">
            <h3 className="text-sm font-semibold mb-2 text-ink-light dark:text-ink-dark">
              Current Goals
            </h3>
            <div className="space-y-2">
              {goals.map((goal) => (
                <Link
                  key={goal.name}
                  href={`/learn/${goal.name}`}
                  onClick={onClose}
                  className="block p-2 rounded hover:bg-gold-light/10 dark:hover:bg-gold-dark/10 transition-colors"
                >
                  <div className="text-sm font-medium text-ink-light dark:text-ink-dark">
                    {goal.name}
                  </div>
                  <div className="text-xs text-ink-light/70 dark:text-ink-dark/70 line-clamp-1">
                    {goal.description}
                  </div>
                </Link>
              ))}
            </div>
          </ParchmentCard>
        )}
      </div>
    </nav>
  );
}
