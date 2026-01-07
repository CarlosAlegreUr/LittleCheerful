import { NextResponse } from 'next/server';
import { profileExists } from '@/lib/file-state';

export async function HEAD() {
  try {
    const exists = await profileExists();

    if (exists) {
      return new NextResponse(null, { status: 200 });
    } else {
      return new NextResponse(null, { status: 404 });
    }
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

export async function GET() {
  try {
    const exists = await profileExists();
    return NextResponse.json({ exists });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
