import { userLogin, userRegister } from '../models/userModel.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userLogin(email, password);
    if (result.success) {
      res.status(200).json({ success: true, user: result.user });
    } else {
      res.status(401).json({ success: false, error: result.error });
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
