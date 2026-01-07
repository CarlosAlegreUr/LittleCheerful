import React from 'react';
import { TreeStructure } from '@/lib/types';
import { TreeNode } from './TreeNode';
import { ScrollContainer } from '@/components/roman/ScrollContainer';

interface ConceptTreeProps {
  treeData: TreeStructure;
  onNodeClick: (conceptKey: string) => void;
  selectedPath: string | null;
}

export function ConceptTree({
  treeData,
  onNodeClick,
  selectedPath,
}: ConceptTreeProps) {
  // Find root nodes (nodes with no parent)
  const rootNodes = Object.entries(treeData.tree).filter(
    ([_, concept]) => concept.parent === null
  );

  // Recursive function to render a node and its children
  const renderNode = (
    conceptKey: string,
    depth: number = 0
  ): React.ReactNode => {
    const concept = treeData.tree[conceptKey];
    if (!concept) return null;

    return (
      <div key={conceptKey}>
        <TreeNode
          conceptKey={conceptKey}
          concept={concept}
          depth={depth}
          isSelected={selectedPath === conceptKey}
          onClick={onNodeClick}
        />
        {/* Render children recursively */}
        {concept.children.length > 0 && (
          <div className="ml-0">
            {concept.children.map((childKey) =>
              renderNode(childKey, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      role="tree"
      aria-label={`Concept tree for ${treeData.goal}`}
      className="w-full"
    >
      <ScrollContainer height="600px">
        <div className="space-y-2 p-4">
          {rootNodes.length === 0 ? (
            <div className="text-center text-ink-light/60 dark:text-ink-dark/60 py-8">
              No concepts yet. Start learning to build your tree!
            </div>
          ) : (
            rootNodes.map(([conceptKey]) => renderNode(conceptKey, 0))
          )}
        </div>
      </ScrollContainer>
    </div>
  );
}
