import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const result = await db.query(
        `UPDATE photos
         SET views = views + 1
         WHERE id = $1
         RETURNING photos.*, (SELECT name FROM users WHERE users.id = photos.user_id) as username`,
        [id]
      );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Фото не найдено' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при получении информации о фото' });
  }
}
