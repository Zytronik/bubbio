import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

export function generateMulterOptions(pathFolder: string) {
  const storage = diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', '..', 'uploads', pathFolder);

      // Check if the directory exists, create it if it doesn't
      fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) {
          cb(err, uploadPath);
        } else {
          cb(null, uploadPath);
        }
      });
    },
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const filename = path.parse(file.originalname).name.replace(/\s/g, '') + timestamp;
      const extension = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  });

  return { storage };
}
