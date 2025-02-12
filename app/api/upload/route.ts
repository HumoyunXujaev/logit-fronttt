import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth';
import { JWTPayload } from '@/lib/jwt';

// Поддерживаемые типы файлов
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

// Максимальный размер файла (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

async function handler(request: NextRequest, payload: JWTPayload) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      throw new ValidationError('No file provided');
    }

    if (!type) {
      throw new ValidationError('File type is required');
    }

    // Проверка типа файла
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ValidationError('File type not allowed');
    }

    // Проверка размера файла
    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError('File size exceeds limit');
    }

    // Создаем уникальное имя файла
    const timestamp = Date.now();
    const filename = `${payload.userId}_${timestamp}_${file.name}`;

    // Определяем путь для сохранения
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, filename);

    // Читаем содержимое файла
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Сохраняем файл
    await writeFile(filePath, buffer);

    // URL для доступа к файлу
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json(
      {
        url: fileUrl,
        type: file.type,
        size: file.size,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export with auth middleware
export const POST = withAuth(handler);
