import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { getMe, updateMe, deleteMe } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', verifyToken, getMe);
router.patch('/me', verifyToken, updateMe);
router.delete('/me', verifyToken, deleteMe);

export default router;

