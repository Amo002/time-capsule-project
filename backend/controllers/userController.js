import { userLogin, userRegister } from '../models/userModel.js';
import jwt from 'jsonwebtoken';


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userLogin(email, password);

    if (result.success) {
      const user = result.user;

      // Generate a JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role_id }, // Payload
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } 
      );

      res.status(200).json({
        success: true,
        user: { id: user.id, username: user.username, email: user.email },
        token,
      });
    } else if (result.error === 'User not found') {
      res.status(404).json({ success: false, error: 'User not found' });
    } else if (result.error === 'Incorrect password') {
      res.status(401).json({ success: false, error: 'Incorrect password' });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};


export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const result = await userRegister(username, email, password);
    if (result.success) {
      res.status(201).json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
