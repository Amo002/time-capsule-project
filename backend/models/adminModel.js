import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export const adminLogin = async (email, password) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return { success: false, error: 'Admin not found' };
    }

    const admin = rows[0];

    if (admin.role_id !== 1) {
      return { success: false, error: 'Not authorized as admin' };
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return { success: false, error: 'Incorrect password' };
    }

    return { success: true, user: { id: admin.id, email: admin.email, username: admin.username } };
  } catch (error) {
    console.error('Database error during admin login:', error);
    return { success: false, error: 'Database error' };
  }
};

