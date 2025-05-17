import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Route: GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

export default router;