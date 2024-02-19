import { diskStorage } from 'multer';
import * as path from 'path';

export function generateMulterOptions(pathFolder: string) {
  const storage = diskStorage({
    destination: path.join(__dirname, '..', 'uploads', pathFolder),
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const filename = path.parse(file.originalname).name.replace(/\s/g, '') + timestamp;
      const extension = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  });

  return { storage };
}
