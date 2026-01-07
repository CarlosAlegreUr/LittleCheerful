import { NextRequest, NextResponse } from 'next/server';
import { executeClaudeCli } from '@/lib/claude-cli';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { option, goalName, conceptPath, sessionId } = body;

    if (!option || !['think', 'hint', 'explain'].includes(option)) {
      return NextResponse.json(
        { error: 'Invalid option. Must be: think, hint, or explain' },
        { status: 400 }
      );
    }

    // Build command args
    const args = [
      '--option', option,
    ];

    if (goalName) args.push('--goal', goalName);
    if (conceptPath) args.push('--concept', conceptPath);
    if (sessionId) args.push('--session', sessionId);

    // Execute 3-option handler via Claude CLI
    const result = await executeClaudeCli({
      command: 'three-option',
      args,
    });

    return NextResponse.json({
      message: result,
      option,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
