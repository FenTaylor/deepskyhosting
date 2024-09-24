import db from '../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    return res.status(200).json({ success: true, user: {
        "id": user.id,
        "name": user.name,
        "email": user.email
    } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error signing in' });
  }
}
