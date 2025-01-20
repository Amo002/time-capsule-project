import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export const userLogin = async (email, password) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return { success: false, error: 'User not found' };
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, error: 'Incorrect password' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Database error during user login:', error);
    return { success: false, error: 'Database error' };
  }
};
