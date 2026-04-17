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


export default router;

