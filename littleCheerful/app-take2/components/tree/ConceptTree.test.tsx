import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConceptTree } from './ConceptTree';
import { TreeStructure } from '@/lib/types';

const mockTreeData: TreeStructure = {
  goal: 'Learn React',
  created: '2026-01-07T00:00:00Z',
  last_updated: '2026-01-07T00:00:00Z',
  max_concepts: 10,
  total_concepts: 3,
  tree: {
    'react-basics': {
      status: 'STUDIED',
      tags: ['intuitive'],
      last_reviewed: '2026-01-07T00:00:00Z',
      parent: null,
      children: ['components', 'hooks'],
    },
    'components': {
      status: 'IN_PROGRESS',
      tags: ['formal'],
      last_reviewed: null,
      parent: 'react-basics',
      children: [],
    },
    'hooks': {
      status: 'NOT_STARTED',
      tags: ['can-apply'],
      last_reviewed: null,
      parent: 'react-basics',
      children: [],
    },
  },
};

describe('ConceptTree', () => {
  it('renders without crashing', () => {
    render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={() => {}}
        selectedPath={null}
      />
    );
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  it('applies tree role for accessibility', () => {
    render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={() => {}}
        selectedPath={null}
      />
    );
    const tree = screen.getByRole('tree');
    expect(tree).toHaveAttribute('aria-label', 'Concept tree for Learn React');
  });

  it('renders all root nodes', () => {
    render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={() => {}}
        selectedPath={null}
      />
    );
    // Should render root node
    expect(screen.getByText('react-basics')).toBeInTheDocument();
  });

  it('renders hierarchical structure with children', () => {
    render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={() => {}}
        selectedPath={null}
      />
    );
    // Root and children should be present
    expect(screen.getByText('react-basics')).toBeInTheDocument();
    expect(screen.getByText('components')).toBeInTheDocument();
    expect(screen.getByText('hooks')).toBeInTheDocument();
  });

  it('calls onNodeClick when node is clicked', async () => {
    const user = userEvent.setup();
    const onNodeClick = jest.fn();
    render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={onNodeClick}
        selectedPath={null}
      />
    );

    const node = screen.getByText('components');
    await user.click(node);
    expect(onNodeClick).toHaveBeenCalledWith('components');
  });

  it('highlights selected node with gold border', () => {
    const { container } = render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={() => {}}
        selectedPath="components"
      />
    );
    // Selected node should have gold border styling
    const selectedNode = screen.getByText('components').closest('[role="treeitem"]');
    expect(selectedNode).toHaveClass('border-gold-light');
  });

  it('uses ScrollContainer for tree layout', () => {
    const { container } = render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={() => {}}
        selectedPath={null}
      />
    );
    // Should be wrapped in a scrollable container
    expect(container.querySelector('[class*="scroll"]')).toBeInTheDocument();
  });

  it('handles empty tree data', () => {
    const emptyTree: TreeStructure = {
      goal: 'Empty Goal',
      created: '2026-01-07T00:00:00Z',
      last_updated: '2026-01-07T00:00:00Z',
      max_concepts: 0,
      total_concepts: 0,
      tree: {},
    };
    render(
      <ConceptTree
        treeData={emptyTree}
        onNodeClick={() => {}}
        selectedPath={null}
      />
    );
    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getByText(/no concepts/i)).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const onNodeClick = jest.fn();
    render(
      <ConceptTree
        treeData={mockTreeData}
        onNodeClick={onNodeClick}
        selectedPath={null}
      />
    );

    const firstNode = screen.getByText('react-basics');
    firstNode.focus();
    await user.keyboard('{Enter}');
    expect(onNodeClick).toHaveBeenCalledWith('react-basics');
  });
});
