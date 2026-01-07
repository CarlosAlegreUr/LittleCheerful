import { NextRequest, NextResponse } from 'next/server';
import { readTreeJson } from '@/lib/file-state';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ goalName: string }> }
) {
  try {
    const { goalName } = await params;
    const tree = await readTreeJson(goalName);

    if (!tree) {
      return NextResponse.json(
        { error: 'Tree not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tree);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
