export function fileName(file: Express.Multer.File): string {
  const fileType = file.mimetype.startsWith('image/') ? 'images' : 'audio';
  return `/uploads/${fileType}/${file.filename}`;
}
