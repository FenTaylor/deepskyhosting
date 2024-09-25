import db from '../../../lib/db';

export default async function handler(req, res) {
    
    try {
      const result = await db.query(
        `SELECT id, name, email FROM users 
        ORDER BY created_at DESC
        LIMIT 10`);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Users not found' });
      }
  
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching users' });
    }
  }