import fs from 'node:fs/promises';
import path from 'node:path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const saveFileLocally = async (file) => {
  // гарантируем, что папка существует
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${Date.now()}_${file.originalname}`;
  const finalPath = path.join(UPLOAD_DIR, filename);

  await fs.rename(file.path, finalPath);

  // URL для фронта
  return `/uploads/${filename}`;
};

