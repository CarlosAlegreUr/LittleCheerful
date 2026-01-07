import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TreeNode } from './TreeNode';
import { ConceptNode } from '@/lib/types';

const mockConcept: ConceptNode = {
  status: 'IN_PROGRESS',
  tags: ['intuitive', 'formal'],
  last_reviewed: null,
  parent: null,
  children: ['child-1', 'child-2'],
};

describe('TreeNode', () => {
  it('renders without crashing', () => {
    render(
      <TreeNode
        conceptKey="test-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    expect(screen.getByRole('treeitem')).toBeInTheDocument();
  });

  it('applies treeitem role for accessibility', () => {
    render(
      <TreeNode
        conceptKey="test-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = screen.getByRole('treeitem');
    expect(node).toHaveAttribute('aria-level', '1'); // depth 0 = level 1
  });

  it('displays concept key as title', () => {
    render(
      <TreeNode
        conceptKey="react-hooks"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    expect(screen.getByText('react-hooks')).toBeInTheDocument();
  });

  it('applies correct indentation based on depth', () => {
    const { container } = render(
      <TreeNode
        conceptKey="nested-concept"
        concept={mockConcept}
        depth={2}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = container.firstChild as HTMLElement;
    // 24px per level per ux-design.md
    expect(node).toHaveStyle({ paddingLeft: '48px' }); // 2 * 24px
  });

  it('applies gold border when selected', () => {
    const { container } = render(
      <TreeNode
        conceptKey="selected-concept"
        concept={mockConcept}
        depth={0}
        isSelected={true}
        onClick={() => {}}
      />
    );
    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass('border-gold-light');
    expect(node).toHaveClass('bg-gold-light/15');
  });

  it('applies status-based coloring for NOT_STARTED', () => {
    const notStartedConcept: ConceptNode = {
      ...mockConcept,
      status: 'NOT_STARTED',
    };
    const { container } = render(
      <TreeNode
        conceptKey="not-started"
        concept={notStartedConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass('border-disabled');
  });

  it('applies status-based coloring for IN_PROGRESS', () => {
    const { container } = render(
      <TreeNode
        conceptKey="in-progress"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass('border-info-light');
  });

  it('applies status-based coloring for STUDIED', () => {
    const studiedConcept: ConceptNode = {
      ...mockConcept,
      status: 'STUDIED',
    };
    const { container } = render(
      <TreeNode
        conceptKey="studied"
        concept={studiedConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass('border-gold-light');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <TreeNode
        conceptKey="clickable-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={onClick}
      />
    );

    const node = screen.getByRole('treeitem');
    await user.click(node);
    expect(onClick).toHaveBeenCalledWith('clickable-concept');
  });

  it('supports keyboard activation with Enter', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <TreeNode
        conceptKey="keyboard-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={onClick}
      />
    );

    const node = screen.getByRole('treeitem');
    node.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledWith('keyboard-concept');
  });

  it('supports keyboard activation with Space', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <TreeNode
        conceptKey="space-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={onClick}
      />
    );

    const node = screen.getByRole('treeitem');
    node.focus();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledWith('space-concept');
  });

  it('renders with illuminated manuscript styling', () => {
    const { container } = render(
      <TreeNode
        conceptKey="styled-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = container.firstChild as HTMLElement;
    // Should use ParchmentCard base
    expect(node).toHaveClass('bg-parchment-light');
    expect(node).toHaveClass('dark:bg-parchment-dark');
  });

  it('indicates expandable state when has children', () => {
    render(
      <TreeNode
        conceptKey="parent-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    const node = screen.getByRole('treeitem');
    expect(node).toHaveAttribute('aria-expanded');
  });

  it('renders tags using TagChip components', () => {
    render(
      <TreeNode
        conceptKey="tagged-concept"
        concept={mockConcept}
        depth={0}
        isSelected={false}
        onClick={() => {}}
      />
    );
    // Tags should be rendered
    expect(screen.getByText('intuitive')).toBeInTheDocument();
    expect(screen.getByText('formal')).toBeInTheDocument();
  });
});
