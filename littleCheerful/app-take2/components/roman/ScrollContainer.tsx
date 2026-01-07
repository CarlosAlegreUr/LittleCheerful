import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface ScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export function ScrollContainer({
  children,
  className,
  height,
}: ScrollContainerProps) {
  return (
    <div
      data-scroll-container
      style={{ height: height || undefined }}
      className={cn('w-full', className)}
    >
      <ScrollArea className="h-full w-full">
        {children}
      </ScrollArea>
    </div>
  );
}
