import express from 'express';
import {
  createSymptom,
  deleteSymptom,
  getAllSymptoms,
  getSymptomById,
  updateSymptom,
} from '../controllers/symptom.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authRoles } from '../middlewares/authRoles.js';

const router = express.Router();

// Public/user access
router.get('/', getAllSymptoms);
router.get('/:id', getSymptomById);

// Admin-only management
router.post('/', verifyToken, authRoles('admin', 'user'), createSymptom);
router.put('/:id', verifyToken, authRoles('admin', 'user'), updateSymptom);
router.delete('/:id', verifyToken, authRoles('admin', 'user'), deleteSymptom);

export default router;

