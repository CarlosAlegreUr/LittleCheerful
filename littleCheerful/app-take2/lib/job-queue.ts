import { JobStatus } from './types';
import { randomUUID } from 'crypto';

// In-memory job store (would use Redis/database in production)
const jobs = new Map<string, JobStatus>();

/**
 * Create a new job
 */
export function createJob(type: 'tree-generation' | 'concept-breakdown'): JobStatus {
  const job: JobStatus = {
    id: randomUUID(),
    type,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  jobs.set(job.id, job);
  return job;
}

/**
 * Update job status
 */
export function updateJob(
  id: string,
  updates: Partial<Omit<JobStatus, 'id' | 'type' | 'createdAt'>>
): JobStatus | null {
  const job = jobs.get(id);
  if (!job) return null;

  const updated = { ...job, ...updates };
  jobs.set(id, updated);
  return updated;
}

/**
 * Get job by ID
 */
export function getJob(id: string): JobStatus | null {
  return jobs.get(id) || null;
}

/**
 * Delete job (cleanup)
 */
export function deleteJob(id: string): boolean {
  return jobs.delete(id);
}

/**
 * Get all jobs (for debugging)
 */
export function getAllJobs(): JobStatus[] {
  return Array.from(jobs.values());
}
