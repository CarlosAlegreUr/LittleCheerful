import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { StudyMaterial } from '@/lib/types';
import { randomUUID } from 'crypto';

const getMaterialsPath = () => {
  const basePath = process.env.CLAUDE_BASE_PATH;
  if (!basePath) {
    throw new Error('CLAUDE_BASE_PATH not set');
  }
  return path.join(basePath, 'materials');
};

export async function GET() {
  try {
    const materialsPath = getMaterialsPath();

    // Ensure directory exists
    await fs.mkdir(materialsPath, { recursive: true });

    // Read materials directory
    const files = await fs.readdir(materialsPath, { withFileTypes: true });

    const materials: StudyMaterial[] = await Promise.all(
      files
        .filter((f) => f.isFile())
        .map(async (file) => {
          const filePath = path.join(materialsPath, file.name);
          const stats = await fs.stat(filePath);

          return {
            id: file.name, // Use filename as ID
            name: file.name,
            type: path.extname(file.name),
            size: stats.size,
            uploadedAt: stats.mtime.toISOString(),
            path: filePath,
          };
        })
    );

    return NextResponse.json(materials);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const materialsPath = getMaterialsPath();
    await fs.mkdir(materialsPath, { recursive: true });

    // Generate unique filename
    const ext = path.extname(file.name);
    const basename = path.basename(file.name, ext);
    const filename = `${basename}-${randomUUID()}${ext}`;
    const filePath = path.join(materialsPath, filename);

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const material: StudyMaterial = {
      id: filename,
      name: file.name,
      type: ext,
      size: buffer.length,
      uploadedAt: new Date().toISOString(),
      path: filePath,
    };

    return NextResponse.json(material, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      );
    }

    const materialsPath = getMaterialsPath();
    const filePath = path.join(materialsPath, id);

    // Security: ensure path is within materials directory
    const resolvedPath = path.resolve(filePath);
    const resolvedMaterialsPath = path.resolve(materialsPath);

    if (!resolvedPath.startsWith(resolvedMaterialsPath)) {
      return NextResponse.json(
        { error: 'Invalid material ID' },
        { status: 400 }
      );
    }

    await fs.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
