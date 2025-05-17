import express from 'express';
import {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  getAgentCount
} from '../controllers/agentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Route: GET /api/agents
router.get('/', getAgents);

// Route: GET /api/agents/count
router.get('/count', getAgentCount);

// Route: GET /api/agents/:id
router.get('/:id', getAgentById);

// Route: POST /api/agents
router.post('/', createAgent);

// Route: PUT /api/agents/:id
router.put('/:id', updateAgent);

// Route: DELETE /api/agents/:id
router.delete('/:id', deleteAgent);

export default router;