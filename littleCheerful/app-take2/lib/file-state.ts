import { promises as fs } from 'fs';
import path from 'path';
import { LearningProfile, TreeStructure } from './types';

const getBasePath = () => {
  const basePath = process.env.CLAUDE_BASE_PATH;
  if (!basePath) {
    throw new Error('CLAUDE_BASE_PATH environment variable not set');
  }
  return basePath;
};

/**
 * Read learning profile
 */
export async function readProfile(): Promise<LearningProfile | null> {
  try {
    const profilePath = path.join(getBasePath(), 'learning-profile.md');
    const content = await fs.readFile(profilePath, 'utf-8');

    // Parse markdown to extract profile data
    // This is a simplified parser - real implementation would be more robust
    const profile: Partial<LearningProfile> = {
      teaching_tone: 'balanced',
      motivation_style: 'balanced',
      default_source_depth: 2,
      terminology_level: 'adaptive',
      example_preferences: 'both',
      preferred_language: 'English',
      created: new Date().toISOString(),
    };

    // Extract fields from markdown
    const toneMatch = content.match(/Selected:\s*(nice|direct|balanced|other)/i);
    if (toneMatch) profile.teaching_tone = toneMatch[1].toLowerCase() as any;

    const motivationMatch = content.match(/Motivation Style[\s\S]*?Selected:\s*(positive-reinforcement|tough-love|balanced)/i);
    if (motivationMatch) profile.motivation_style = motivationMatch[1] as any;

    const depthMatch = content.match(/Default Source Depth[\s\S]*?Selected:\s*(\d)/i);
    if (depthMatch) profile.default_source_depth = parseInt(depthMatch[1]) as any;

    const termMatch = content.match(/Terminology Level[\s\S]*?Selected:\s*(casual|academic|adaptive)/i);
    if (termMatch) profile.terminology_level = termMatch[1] as any;

    const exampleMatch = content.match(/Example Preferences[\s\S]*?Selected:\s*(analogies|formal-definitions|both)/i);
    if (exampleMatch) profile.example_preferences = exampleMatch[1] as any;

    const langMatch = content.match(/Preferred Language[\s\S]*?Selected:\s*([^\n]+)/i);
    if (langMatch) profile.preferred_language = langMatch[1].trim();

    return profile as LearningProfile;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * Write learning profile
 */
export async function writeProfile(profile: LearningProfile): Promise<void> {
  const profilePath = path.join(getBasePath(), 'learning-profile.md');

  const content = `# Learning Profile

## Teaching Tone
Selected: ${profile.teaching_tone}
${profile.custom_tone ? `\nUser's custom specification:\n"${profile.custom_tone}"` : ''}

## Motivation Style
Selected: ${profile.motivation_style}

## Default Source Depth
Selected: ${profile.default_source_depth}

## Terminology Level
Selected: ${profile.terminology_level}

## Example Preferences
Selected: ${profile.example_preferences}

## Preferred Language
Selected: ${profile.preferred_language}

## Created
${profile.created}

${profile.last_updated ? `## Last Updated\n${profile.last_updated}` : ''}
`;

  await fs.writeFile(profilePath, content, 'utf-8');
}

/**
 * Read tree.json for a goal
 */
export async function readTreeJson(goalName: string): Promise<TreeStructure | null> {
  try {
    const treePath = path.join(getBasePath(), 'study-goals', goalName, 'tree.json');
    const content = await fs.readFile(treePath, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * Write tree.json for a goal
 */
export async function writeTreeJson(goalName: string, tree: TreeStructure): Promise<void> {
  const treePath = path.join(getBasePath(), 'study-goals', goalName, 'tree.json');
  await fs.mkdir(path.dirname(treePath), { recursive: true });
  await fs.writeFile(treePath, JSON.stringify(tree, null, 2), 'utf-8');
}

/**
 * Read concept.md content
 */
export async function readConcept(goalName: string, conceptPath: string): Promise<string | null> {
  try {
    const fullPath = path.join(getBasePath(), 'study-goals', goalName, conceptPath, 'concept.md');
    return await fs.readFile(fullPath, 'utf-8');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * Read global progress
 */
export async function readGlobalProgress(): Promise<any> {
  try {
    const progressPath = path.join(getBasePath(), 'global-progress.json');
    const content = await fs.readFile(progressPath, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return { goals: {}, created: new Date().toISOString(), last_updated: new Date().toISOString() };
    }
    throw error;
  }
}

/**
 * Write global progress
 */
export async function writeGlobalProgress(progress: any): Promise<void> {
  const progressPath = path.join(getBasePath(), 'global-progress.json');
  await fs.writeFile(progressPath, JSON.stringify(progress, null, 2), 'utf-8');
}

/**
 * Check if profile exists
 */
export async function profileExists(): Promise<boolean> {
  try {
    const profilePath = path.join(getBasePath(), 'learning-profile.md');
    await fs.access(profilePath);
    return true;
  } catch {
    return false;
  }
}
