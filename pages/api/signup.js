// pages/api/signup.js
import db from '../../lib/db';
import bcrypt from 'bcrypt'; 

export default async function handler(req, res) {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    );

    const userId = result.rows[0].id;

    return res.status(201).json({ success: true, userId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error creating user' });
  }
}
