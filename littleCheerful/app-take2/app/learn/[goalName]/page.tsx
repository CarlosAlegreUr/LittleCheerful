'use client';

import { use, useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ConceptTree } from '@/components/tree/ConceptTree';
import { QuillLoader } from '@/components/roman/QuillLoader';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChat';
import { useTree } from '@/hooks/useTree';
import { useJob } from '@/hooks/useJob';

export default function GoalPage(props: { params: Promise<{ goalName: string }> }) {
  const params = use(props.params);
  const goalName = decodeURIComponent(params.goalName);

  const { messages, sendMessage, isStreaming, error: chatError } = useChat();
  const { tree, isLoading: treeLoading, error: treeError, refetch: refetchTree } = useTree(goalName);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [generatingJobId, setGeneratingJobId] = useState<string | null>(null);
  const { job, isPolling } = useJob(generatingJobId || '', !!generatingJobId);

  const handleTreeGenerate = async () => {
    try {
      const response = await fetch(`/api/tree/${goalName}/generate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to start tree generation');
      }

      const data = await response.json();
      setGeneratingJobId(data.jobId);
    } catch (error) {
      console.error('Tree generation failed:', error);
    }
  };

  // When job completes, refetch tree
  if (job?.status === 'completed' && generatingJobId) {
    setGeneratingJobId(null);
    refetchTree();
  }

  const handleNodeClick = (conceptKey: string) => {
    setSelectedPath(conceptKey);
    // Optionally send a context message to chat
    sendMessage(`I'm looking at the concept: ${conceptKey}`);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-display font-semibold mb-8" style={{ color: 'var(--color-crimson)' }}>
          Learning: {goalName}
        </h1>

        {treeError ? (
          <div className="p-8 rounded-lg bg-crimson-light/10 dark:bg-crimson-dark/10">
            <p className="text-center text-crimson-light dark:text-crimson-dark">
              Error: {treeError}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface - 2/3 width */}
            <div className="lg:col-span-2">
              <ChatInterface
                messages={messages}
                onSendMessage={sendMessage}
                isStreaming={isStreaming}
              />
              {chatError && (
                <p className="mt-4 text-sm text-crimson-light dark:text-crimson-dark">
                  Error: {chatError}
                </p>
              )}
            </div>

            {/* Concept Tree - 1/3 width */}
            <div>
              {treeLoading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <QuillLoader />
                  <p className="mt-4 text-center" style={{ color: 'var(--color-ink)' }}>
                    Loading tree...
                  </p>
                </div>
              ) : isPolling ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <QuillLoader />
                  <p className="mt-4 text-center" style={{ color: 'var(--color-ink)' }}>
                    Generating tree... ({job?.progress || 0}%)
                  </p>
                </div>
              ) : !tree || tree.total_concepts === 0 ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <p className="mb-4 text-center" style={{ color: 'var(--color-ink)' }}>
                    No tree yet. Generate one to start!
                  </p>
                  <Button onClick={handleTreeGenerate}>
                    Generate Tree
                  </Button>
                </div>
              ) : (
                <ConceptTree
                  treeData={tree}
                  onNodeClick={handleNodeClick}
                  selectedPath={selectedPath}
                />
              )}
            </div>
          </div>
        )}

        {/* Selected concept context (hidden, for tests) */}
        {selectedPath && (
          <div className="sr-only">
            Selected: {selectedPath}
          </div>
        )}
      </div>
    </main>
  );
}
