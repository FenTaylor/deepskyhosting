import db from '../../../lib/db';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const form = formidable({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при загрузке данных' });
      }

      const userId = fields.id ? fields.id[0] : null;
      if (!userId) {
        return res.status(400).json({ message: 'Не указан user_id' });
      }

      let updatedFields = {};

      if (fields.name) {
        updatedFields.name = fields.name[0];
      }

      if (fields.password && fields.password[0]) {
        const hashedPassword = await bcrypt.hash(fields.password[0], 10);
        updatedFields.password = hashedPassword;
      }

      try {
        await db.query(
          'UPDATE users SET name = $1, password = COALESCE($2, password) WHERE id = $3',
          [updatedFields.name, updatedFields.password, userId]
        );
      } catch (err) {
        return res.status(500).json({ message: 'Ошибка при обновлении имени или пароля' });
      }

      if (fields.deleteAvatar && fields.deleteAvatar[0] === 'true') {
        const avatarFilePath = path.join(process.cwd(), 'public/uploads/avatars', `${userId}_*`);
        try {
          const files = await fs.readdir(path.dirname(avatarFilePath));
          for (const file of files) {
            if (file.startsWith(`${userId}_`)) {
              await fs.unlink(path.join(path.dirname(avatarFilePath), file));
            }
          }
          await db.query('UPDATE users SET avatar = NULL WHERE id = $1', [userId]);
        } catch (err) {
          return res.status(500).json({ message: 'Ошибка при удалении аватара' });
        }
      }

      if (files.avatar) {
        const avatarFile = files.avatar[0];
        const avatarFilePath = avatarFile.filepath;

        if (!avatarFilePath) {
          return res.status(400).json({ message: 'Ошибка: путь к файлу не найден' });
        }

        const extension = path.extname(avatarFile.originalFilename);
        const avatarFileName = `${uuidv4()}${extension}`;
        const avatarNewPath = path.join(process.cwd(), 'public/uploads/avatars', avatarFileName);

        try {
          // Ресайз до 300px по меньшей стороне и кроп до 300x300
          await sharp(avatarFilePath)
            .resize(300, 300, {
              fit: sharp.fit.cover, // Обрезка изображения, чтобы оно вписалось в 300x300
            })
            .toFile(avatarNewPath);

          await db.query('UPDATE users SET avatar = $1 WHERE id = $2', [avatarFileName, userId]);
        } catch (err) {
          return res.status(500).json({ message: 'Ошибка при обработке аватара' });
        }
      }

      try {
        const updatedUser = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        return res.status(200).json(updatedUser.rows[0]);
      } catch (err) {
        return res.status(500).json({ message: 'Ошибка при получении обновленного профиля' });
      }
    });
  } else {
    return res.status(405).json({ message: 'Метод не разрешён' });
  }
}
