import { adminLogin } from '../models/adminModel.js';

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await adminLogin(email, password);
    if (result.success) {
      res.status(200).json({ success: true, admin: result.user });
    } else {
      res.status(401).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
