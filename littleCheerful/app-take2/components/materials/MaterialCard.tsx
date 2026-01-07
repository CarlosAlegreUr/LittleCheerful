'use client';

import * as React from 'react';
import { ParchmentCard } from '@/components/roman/ParchmentCard';
import { StudyMaterial } from '@/lib/types';
import { Book, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MaterialCardProps {
  material: StudyMaterial;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export function MaterialCard({ material, onDelete, onSelect }: MaterialCardProps) {
  const handleCardClick = () => {
    onSelect(material.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent onSelect from firing
    onDelete(material.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(material.id);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  };

  const isPdf = material.type === 'application/pdf' || material.name.endsWith('.pdf');

  return (
    <ParchmentCard
      data-material-card
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative cursor-pointer transition-all hover:shadow-lg',
        'group p-4 space-y-3'
      )}
    >
      {/* File Icon */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {isPdf ? (
            <Book
              data-icon="book"
              className="h-10 w-10 text-gold-light dark:text-gold-dark"
            />
          ) : (
            <FileText
              data-icon="file-text"
              className="h-10 w-10 text-gold-light dark:text-gold-dark"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-ink-light dark:text-ink-dark truncate">
              {material.name}
            </h3>
            <p className="text-sm text-ink-light dark:text-ink-dark opacity-60">
              {formatFileSize(material.size)}
            </p>
          </div>
        </div>

        {/* Delete Button (hover reveal) */}
        <button
          onClick={handleDeleteClick}
          aria-label="Delete material"
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'p-1 rounded-md hover:bg-danger-light/10 dark:hover:bg-danger-dark/10'
          )}
        >
          <X className="h-5 w-5 text-danger-light dark:text-danger-dark" />
        </button>
      </div>
    </ParchmentCard>
  );
}
