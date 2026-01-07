import { NextRequest, NextResponse } from 'next/server';
import { readTreeJson, writeTreeJson, readGlobalProgress, writeGlobalProgress } from '@/lib/file-state';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalName, goalDescription } = body;

    if (!goalName) {
      return NextResponse.json(
        { error: 'goalName is required' },
        { status: 400 }
      );
    }

    // Check if goal already exists
    const existingTree = await readTreeJson(goalName);

    if (existingTree) {
      // Goal exists, return existing tree
      return NextResponse.json({
        exists: true,
        tree: existingTree,
        message: 'Goal already exists',
      });
    }

    // Goal doesn't exist, needs tree generation
    return NextResponse.json({
      exists: false,
      message: 'Goal needs tree generation',
      goalName,
      goalDescription,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
