import express from 'express';
import { analyzeSymptoms } from '../controllers/prediction.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, analyzeSymptoms);

export default router;
