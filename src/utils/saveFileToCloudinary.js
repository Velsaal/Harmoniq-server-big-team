import fs from 'fs/promises';
import path from 'path';
import { UPLOAD_DIR } from '../constants/index.js';

export const saveFileLocally = async (file) => {
  const destinationPath = path.join(UPLOAD_DIR, file.filename);

  // переносим файл из temp → uploads
  await fs.rename(file.path, destinationPath);

  return `/uploads/${file.filename}`;
};
