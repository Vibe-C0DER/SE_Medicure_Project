import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authRoles } from '../middlewares/authRoles.js';
import {
  getUserReports,
  getReportById,
  getAllReportsAdmin,
  downloadReportPDF,
} from '../controllers/report.controller.js';

const router = express.router;

// Keep them separate or use a single router
// I will export an object or two routers if needed, but standard is single default router

// Wait, standard express route is `express.Router()`
const userReportRouter = express.Router();
const adminReportRouter = express.Router();

// User Report Routes (/api/reports)
userReportRouter.get('/me', verifyToken, getUserReports);
userReportRouter.get('/:id', verifyToken, getReportById);
userReportRouter.get('/:id/pdf', verifyToken, downloadReportPDF);

// Admin Report Routes (/api/admin/reports)
adminReportRouter.get('/', verifyToken, authRoles('admin'), getAllReportsAdmin);

export { userReportRouter, adminReportRouter };
