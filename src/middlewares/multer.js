
import multer from 'multer';
import fs from 'node:fs';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

// гарантируем наличие временной директории для загрузок
fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

export const upload = multer({
    storage,
    limits: {
    fileSize: 1 * 1024 * 1024, 
  },});
