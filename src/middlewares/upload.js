import multer from 'multer';
import path from 'path';
import fs from 'node:fs';

const uploadDir = path.join(process.cwd(), 'uploads');

// гарантируем, что папка для загрузок существует
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}_${name}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default upload;
