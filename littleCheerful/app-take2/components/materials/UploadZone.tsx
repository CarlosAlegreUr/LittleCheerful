'use client';

import * as React from 'react';
import { QuillLoader } from '@/components/roman/QuillLoader';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadZoneProps {
  onFileSelect: (files: FileList) => void;
  accept: string;
  isUploading: boolean;
}

export function UploadZone({ onFileSelect, accept, isUploading }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      data-upload-zone
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        // Base styling - open book metaphor
        'relative flex flex-col items-center justify-center',
        'min-h-[200px] rounded-2xl cursor-pointer transition-all',
        'bg-marble-light dark:bg-marble-dark',

        // Dashed border (idle state)
        !isDragOver && !isUploading && 'border-4 border-dashed border-border-medium',

        // Drag-over state (gold border)
        isDragOver && 'border-4 border-solid border-gold-light dark:border-gold-dark',
        isDragOver && 'bg-gold-light/10 dark:bg-gold-dark/10',

        // Uploading state
        isUploading && 'border-2 border-solid border-info-light dark:border-info-dark',
        isUploading && 'bg-info-light/5 dark:bg-info-dark/5'
      )}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="sr-only"
        aria-label="Upload file"
      />

      {isUploading ? (
        // Uploading state with QuillLoader
        <QuillLoader text="Transcribing scroll..." />
      ) : (
        // Idle state with open book icon
        <>
          <Upload
            className={cn(
              'transition-all',
              isDragOver
                ? 'h-18 w-18 opacity-100'
                : 'h-16 w-16 opacity-40',
              'text-ink-light dark:text-ink-dark'
            )}
          />
          <div className="mt-4 text-center space-y-1">
            <p className="text-lg font-semibold text-ink-light dark:text-ink-dark">
              Drop your scrolls here
            </p>
            <p className="text-sm text-ink-light dark:text-ink-dark opacity-60">
              or click to browse
            </p>
            <p className="text-xs text-ink-light dark:text-ink-dark opacity-50 mt-2">
              Supported formats: {accept}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
