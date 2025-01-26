import express from 'express';
import { loginUser } from '../controllers/userController.js';
import { registerUser } from '../controllers/userController.js';
import { capsulesFetch } from '../controllers/userController.js';
import { addCapsule } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/profile/:userId/fetch-capsules',capsulesFetch)
router.post('/profile/:userId/add-capsule', authMiddleware, addCapsule);




export default router;
