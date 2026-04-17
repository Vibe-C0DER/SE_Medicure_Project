import express from 'express';
import { verifyAdmin } from '../../middlewares/auth.middleware.js';
import { getDashboardStats, getRecentActivity } from '../../controllers/admin.dashboard.controller.js';

const router = express.Router();
router.use(verifyAdmin);

router.get('/stats', getDashboardStats);
router.get('/recent', getRecentActivity);

export default router;
