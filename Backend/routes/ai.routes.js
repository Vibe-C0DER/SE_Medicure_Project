import express from 'express';
import { analyzeTextSymptoms } from '../controllers/ai.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/analyze', verifyToken, analyzeTextSymptoms);

export default router;
