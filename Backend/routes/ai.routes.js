import express from 'express';
import { analyzeTextSymptoms } from '../controllers/ai.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { analyzeLimiter } from '../middlewares/rateLimiter.js';
import { checkAiCache } from '../middlewares/aiCache.js';

const router = express.Router();

router.post('/analyze', verifyToken, analyzeLimiter, checkAiCache, analyzeTextSymptoms);

export default router;
