import { NextRequest, NextResponse } from 'next/server';
import { readProfile, writeProfile } from '@/lib/file-state';
import { LearningProfile } from '@/lib/types';

export async function GET() {
  try {
    const profile = await readProfile();

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const profile: LearningProfile = {
      teaching_tone: body.teaching_tone || 'balanced',
      custom_tone: body.custom_tone,
      motivation_style: body.motivation_style || 'balanced',
      default_source_depth: body.default_source_depth || 2,
      terminology_level: body.terminology_level || 'adaptive',
      example_preferences: body.example_preferences || 'both',
      preferred_language: body.preferred_language || 'English',
      created: body.created || new Date().toISOString(),
      last_updated: new Date().toISOString(),
    };

    await writeProfile(profile);

    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
