import fs from 'node:fs/promises';

export const saveFileToCloudinary = async (file) => {
  console.log("⚠️ Cloudinary disabled — returning local file path instead.");

  // Просто возвращаем путь к файлу (или любой фейковый URL)
  const fakeUrl = `/uploads/${file.originalname}`;

  // Удаляем временный файл, чтобы не копился мусор
  await fs.unlink(file.path);

  return fakeUrl;
};
