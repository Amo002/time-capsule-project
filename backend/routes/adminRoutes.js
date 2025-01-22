import express from 'express';
import { loginAdmin } from '../controllers/adminController.js';
import { authMiddleware, adminAuthMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);

router.get('/dashboard', authMiddleware, adminAuthMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the admin dashboard.' });
});

router.get('/fetchUsers', fetchUsers);

export default router;
