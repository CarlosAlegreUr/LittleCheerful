'use client';

import { useState, useEffect } from 'react';
import { ParchmentCard } from '@/components/roman/ParchmentCard';
import { UploadZone } from '@/components/materials/UploadZone';
import { MaterialList } from '@/components/materials/MaterialList';
import { QuillLoader } from '@/components/roman/QuillLoader';
import type { StudyMaterial } from '@/lib/types';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/materials');

        if (!response.ok && response.status !== 404) {
          throw new Error(`Failed to fetch materials: ${response.statusText}`);
        }

        if (response.ok) {
          const data = await response.json();
          setMaterials(data.materials || []);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const handleUpload = async (fileList: FileList) => {
    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      Array.from(fileList).forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/materials', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload: ${response.statusText}`);
      }

      const newMaterial = await response.json();

      // Add to materials list
      setMaterials((prev) => [...prev, newMaterial]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelect = (id: string) => {
    // Navigate to material view or show in modal
    console.log('Selected material:', id);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/materials', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      // Remove from materials list
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display font-semibold mb-8" style={{ color: 'var(--color-crimson)' }}>
          Study Materials
        </h1>

        {/* Upload Zone */}
        <div className="mb-8">
          <UploadZone
            onFileSelect={handleUpload}
            accept=".pdf,.txt,.md"
            isUploading={isUploading}
          />
        </div>

        {/* Error Display */}
        {error && (
          <ParchmentCard className="mb-8 p-4">
            <p className="text-center text-crimson-light dark:text-crimson-dark">
              Error: {error}
            </p>
          </ParchmentCard>
        )}

        {/* Materials List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <QuillLoader />
          </div>
        ) : materials.length === 0 ? (
          <ParchmentCard className="p-8">
            <p className="text-center text-ink-light dark:text-ink-dark">
              No materials yet. Upload some study materials to get started!
            </p>
          </ParchmentCard>
        ) : (
          <MaterialList materials={materials} onDelete={handleDelete} onSelect={handleSelect} />
        )}
      </div>
    </main>
  );
}
