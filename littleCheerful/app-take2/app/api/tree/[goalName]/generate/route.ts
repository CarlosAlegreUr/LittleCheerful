import { NextRequest, NextResponse } from 'next/server';
import { createJob, updateJob } from '@/lib/job-queue';
import { executeClaudeCli } from '@/lib/claude-cli';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ goalName: string }> }
) {
  try {
    const { goalName } = await params;
    const body = await request.json();

    // Create a job for tree generation
    const job = createJob('tree-generation');

    // Start tree generation asynchronously
    (async () => {
      try {
        updateJob(job.id, { status: 'running', message: 'Generating tree...' });

        const timeout = parseInt(process.env.TREE_GENERATION_TIMEOUT_SECONDS || '180') * 1000;

        // Spawn tree-builder agent via Claude CLI
        const result = await executeClaudeCli({
          command: 'tree-builder',
          args: [
            '--goal-name', goalName,
            '--goal-description', body.goalDescription || '',
          ],
          timeout,
        });

        updateJob(job.id, {
          status: 'completed',
          message: 'Tree generated successfully',
          result: JSON.parse(result),
          completedAt: new Date().toISOString(),
        });
      } catch (error: any) {
        updateJob(job.id, {
          status: 'failed',
          error: error.message,
          completedAt: new Date().toISOString(),
        });
      }
    })();

    return NextResponse.json({ jobId: job.id }, { status: 202 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
