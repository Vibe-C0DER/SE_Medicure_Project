import express from 'express';
import { verifyAdmin } from '../../middlewares/auth.middleware.js';
import { getAllReportsAdmin, deleteReport } from '../../controllers/report.controller.js';

const router = express.Router();
router.use(verifyAdmin);
router.get('/', getAllReportsAdmin);
router.delete('/:id', deleteReport);

export default router;
