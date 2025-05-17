import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadAndDistribute, getAgentListItems } from '../controllers/listController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Route: POST /api/lists/upload
router.post('/upload', upload.single('file'), uploadAndDistribute);

// Route: GET /api/lists/agent/:agentId
router.get('/agent/:agentId', getAgentListItems);

export default router;