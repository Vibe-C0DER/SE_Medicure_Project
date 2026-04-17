import express from 'express';
import {
  createDisease,
  deleteDisease,
  getAllDiseases,
  getDiseaseById,
  updateDisease,
} from '../controllers/disease.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authRoles } from '../middlewares/authRoles.js';

const router = express.Router();

// All disease routes require authentication
router.get('/', verifyToken, getAllDiseases);
router.get('/:id', verifyToken, getDiseaseById);



export default router;

