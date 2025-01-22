import express from 'express';
import { loginUser } from '../controllers/userController.js';
import { registerUser } from '../controllers/userController.js';
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

export default router;
