import db from '../../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { name, description, link, photo_date } = req.body;

    try {
      const result = await db.query(
        'UPDATE photos SET name = $1, description = $2, link = $3, photo_date = $4 WHERE id = $5',
        [name, description, link, photo_date, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Фото не найдено' });
      }

      res.status(200).json({ message: 'Изменения сохранены' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка при сохранении изменений' });
    }
  } else {
    res.status(405).json({ message: 'Метод не разрешён' });
  }
}
