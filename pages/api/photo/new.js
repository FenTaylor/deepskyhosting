import db from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const result = await db.query(
      `SELECT photos.*, users.name as username 
       FROM photos 
       JOIN users ON photos.user_id = users.id 
       ORDER BY created_at DESC 
       LIMIT 50`
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при получении фотографий' });
  }
}
