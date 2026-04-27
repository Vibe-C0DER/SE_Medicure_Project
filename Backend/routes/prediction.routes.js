import express from 'express';
import { analyzeSymptoms } from '../controllers/prediction.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { reportsLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// The prediction endpoint performs Report Creation internally
router.post('/', verifyToken, reportsLimiter, analyzeSymptoms);

export default router;
