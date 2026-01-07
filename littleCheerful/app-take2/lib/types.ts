// Type definitions for Little Cheerful Web UI

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  goalName?: string;
  conceptPath?: string;
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  requiresOption?: boolean;
}

export interface TreeStructure {
  goal: string;
  created: string;
  last_updated: string;
  max_concepts: number;
  total_concepts: number;
  tree: Record<string, ConceptNode>;
}

export interface ConceptNode {
  status: ConceptStatus;
  tags: string[];
  last_reviewed: string | null;
  parent: string | null;
  children: string[];
}

export type ConceptStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'STUDIED';

export interface LearningProfile {
  teaching_tone: 'nice' | 'direct' | 'balanced' | 'other';
  custom_tone?: string;
  motivation_style: 'positive-reinforcement' | 'tough-love' | 'balanced';
  default_source_depth: 1 | 2 | 3 | 4;
  terminology_level: 'casual' | 'academic' | 'adaptive';
  example_preferences: 'analogies' | 'formal-definitions' | 'both';
  preferred_language: string;
  created: string;
  last_updated?: string;
}

export interface StudyMaterial {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  path: string;
}

export interface ThreeOptionState {
  message: string;
  options: ['think' | 'hint' | 'explain'];
}

export interface OperationStatus {
  status: 'pending' | 'running' | 'completed' | 'failed';
  message?: string;
  progress?: number;
  result?: unknown;
  error?: string;
}

export interface JobStatus extends OperationStatus {
  id: string;
  type: 'tree-generation' | 'concept-breakdown';
  createdAt: string;
  completedAt?: string;
}
