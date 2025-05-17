import express from 'express';
import {
  getDistributions,
  getDistributionById,
  getDistributionDetails
} from '../controllers/distributionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Route: GET /api/distributions
router.get('/', getDistributions);

// Route: GET /api/distributions/:id
router.get('/:id', getDistributionById);

// Route: GET /api/distributions/:id/details
router.get('/:id/details', getDistributionDetails);

export default router;