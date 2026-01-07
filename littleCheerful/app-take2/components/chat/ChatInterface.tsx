import React from 'react';
import { ParchmentCard } from '@/components/roman/ParchmentCard';
import { ScrollContainer } from '@/components/roman/ScrollContainer';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ThreeOptionPrompt } from './ThreeOptionPrompt';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ThreeOptionState {
  show: boolean;
  onOptionSelect: (option: 'think' | 'hint' | 'explain') => void;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
  threeOptionState?: ThreeOptionState;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isStreaming,
  threeOptionState,
}) => {
  return (
    <ParchmentCard
      className="flex flex-col h-full"
      role="region"
      aria-label="Chat interface"
    >
      <ScrollContainer className="flex-1 mb-4">
        <div role="log" aria-live="polite" className="space-y-4 p-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
        </div>
      </ScrollContainer>

      {threeOptionState?.show && (
        <div className="mb-4 px-4">
          <ThreeOptionPrompt
            onOptionSelect={threeOptionState.onOptionSelect}
            disabled={isStreaming}
          />
        </div>
      )}

      <div className="px-4 pb-4">
        <ChatInput
          onSend={onSendMessage}
          disabled={isStreaming}
          placeholder="Type your message..."
        />
      </div>
    </ParchmentCard>
  );
};
