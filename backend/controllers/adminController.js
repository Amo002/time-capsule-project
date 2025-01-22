import { adminLogin } from '../models/adminModel.js';
import jwt from 'jsonwebtoken';

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await adminLogin(email, password);
    if (result.success) {

      const token = jwt.sign(
        { id: result.user.id, email: result.user.email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        success: true,
        admin: result.user,
        token,
      });
    } else {
      res.status(401).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const fetchUsers = async (req, res) => {
  
  return;
};