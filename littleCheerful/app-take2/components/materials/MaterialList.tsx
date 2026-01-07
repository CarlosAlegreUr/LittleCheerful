'use client';

import * as React from 'react';
import { ScrollContainer } from '@/components/roman/ScrollContainer';
import { MaterialCard } from './MaterialCard';
import { StudyMaterial } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface MaterialListProps {
  materials: StudyMaterial[];
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export function MaterialList({ materials, onDelete, onSelect }: MaterialListProps) {
  if (materials.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-ink-light dark:text-ink-dark opacity-60 text-center">
          No materials yet
        </p>
      </div>
    );
  }

  return (
    <ScrollContainer height="100%">
      <div
        data-material-grid
        className={cn(
          'grid gap-4 p-4',
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {materials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        ))}
      </div>
    </ScrollContainer>
  );
}
