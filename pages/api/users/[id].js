import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const result = await db.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching user' });
  }
}