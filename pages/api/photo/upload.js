import { promises as fs } from 'fs';
import path from 'path';
import db from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Отключаем встроенный body parser Next.js, чтобы использовать formidable
  },
};

const uploadPhoto = async (req, res) => {
  if (req.method === 'POST') {
    const form = formidable({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error parsing the form' });
      }

      const file = files.photo[0]; 
      const userId = fields.user_id[0];

      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user_id' });
      }

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const originalFilename = file.originalFilename || file.newFilename || file.filepath;
      const extension = path.extname(originalFilename);
      const uniqueFileName = `${uuidv4()}${extension}`;
      const uniqueUrl = uuidv4().slice(0, 8);

      // Оригинал сохраняем в temp, т.к. потом будем заливать в AWS s3
      const uploadDir = path.join(process.cwd(), 'public/uploads/photos/temp');


      const fileBuffer = await fs.readFile(file.filepath);

      const image = sharp(fileBuffer);
      const metadata = await image.metadata();
      const scale = `${metadata.width}x${metadata.height}`;
      const sizeKb = Math.round(file.size / 1024);

      await fs.writeFile(path.join(uploadDir, uniqueFileName), fileBuffer);

      const result = await db.query(
        'INSERT INTO photos (user_id, unique_url, file_name, scale, size_kb) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, uniqueUrl, uniqueFileName, scale, sizeKb]
      );

      const photoId = result.rows[0].id;

      return res.status(201).json({ success: true, unique_url: uniqueUrl, photo_id: photoId });
    });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default uploadPhoto;
