import React from 'react';
import { cn } from '@/lib/utils';
import { ConceptNode, ConceptStatus } from '@/lib/types';
import { TagChip } from './TagChip';

interface TreeNodeProps {
  conceptKey: string;
  concept: ConceptNode;
  depth: number;
  isSelected: boolean;
  onClick: (key: string) => void;
}

const statusBorderStyles: Record<ConceptStatus, string> = {
  NOT_STARTED: 'border-disabled',
  IN_PROGRESS: 'border-info-light dark:border-info-dark',
  STUDIED: 'border-gold-light dark:border-gold-dark',
};

const tagVariantMap: Record<string, 'intuitive' | 'formal' | 'can-apply'> = {
  intuitive: 'intuitive',
  formal: 'formal',
  'can-apply': 'can-apply',
};

export function TreeNode({
  conceptKey,
  concept,
  depth,
  isSelected,
  onClick,
}: TreeNodeProps) {
  const handleClick = () => {
    onClick(conceptKey);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(conceptKey);
    }
  };

  const indentationPx = depth * 24; // 24px per level per ux-design.md

  return (
    <div
      role="treeitem"
      aria-level={depth + 1} // aria-level is 1-indexed
      aria-selected={isSelected}
      aria-expanded={concept.children.length > 0 ? 'true' : undefined}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ paddingLeft: `${indentationPx}px` }}
      className={cn(
        // Base ParchmentCard styling
        'bg-parchment-light dark:bg-parchment-dark',
        'texture-parchment', // Paper grain texture
        'border-l-4',
        statusBorderStyles[concept.status],
        'rounded-xl',
        'p-4',
        'cursor-pointer',
        'transition-colors duration-200',
        'node-glow', // Gold shadow on hover from globals.css
        // Hover state
        'hover:bg-gold-light/5 dark:hover:bg-gold-dark/10',
        // Selected state
        isSelected && [
          'border-gold-light dark:border-gold-dark',
          'bg-gold-light/15 dark:bg-gold-dark/15',
        ],
        // Focus state
        'focus:outline-none focus:ring-2 focus:ring-gold-light dark:focus:ring-gold-dark'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Concept title */}
        <h3 className="text-base font-semibold text-ink-light dark:text-ink-dark flex-grow">
          {conceptKey}
        </h3>

        {/* Tags */}
        <div className="flex gap-2">
          {concept.tags.map((tag) => {
            const variant = tagVariantMap[tag] || 'formal';
            return <TagChip key={tag} tag={tag} variant={variant} />;
          })}
        </div>
      </div>
    </div>
  );
}
