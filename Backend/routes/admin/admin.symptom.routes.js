import express from 'express';
import { verifyAdmin } from '../../middlewares/auth.middleware.js';
import { createSymptom, getAllSymptoms, updateSymptom, deleteSymptom } from '../../controllers/symptom.controller.js';

const router = express.Router();
router.use(verifyAdmin);
router.get('/', getAllSymptoms);
router.post('/', createSymptom);
router.put('/:id', updateSymptom);
router.delete('/:id', deleteSymptom);

export default router;
