import multer from 'multer';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import { FileFilterCallback } from 'multer';
import crypto from 'crypto';

function getFileType(mimetype: string): string | null {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype.startsWith('audio/')) return 'audio';
  return null;
}

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const folder = getFileType(file.mimetype);

    if (!folder) {
      return cb(new Error('File type not allowed'), '');
    }

    const uploadPath = path.join(__dirname, '..', '..', 'uploads', folder);

    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, '_');
    const uniqueSuffix =
      Date.now() + '-' + crypto.randomBytes(4).toString('hex');
    const safeName = `${baseName}-${uniqueSuffix}${ext}`;
    cb(null, safeName);
  },
});

export const uploader = multer({
  storage,
  limits: { fileSize: 9 * 1024 * 1024 }, // 9MB
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const allowedExt = ['.png', '.jpg', '.jpeg', '.mp3'];
    const allowedMime = ['image/png', 'image/jpeg', 'image/jpg', 'audio/mpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (!allowedExt.includes(ext)) {
      return cb(new Error('Invalid file extension.'));
    }

    if (!allowedMime.includes(mime)) {
      return cb(new Error('Invalid MIME type.'));
    }

    cb(null, true);
  },
});
