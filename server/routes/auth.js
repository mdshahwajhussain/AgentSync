import express from 'express';
import { login, signup, verifyToken } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Route: POST /api/auth/signup
router.post('/signup', signup);

// Route: POST /api/auth/login
router.post('/login', login);

// Route: GET /api/auth/verify
router.get('/verify', protect, verifyToken);

export default router;