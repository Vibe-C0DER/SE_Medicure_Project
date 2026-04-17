import express from 'express';
import { verifyAdmin } from '../../middlewares/auth.middleware.js';
import { createDisease, getAllDiseases, updateDisease, deleteDisease } from '../../controllers/disease.controller.js';

const router = express.Router();
router.use(verifyAdmin);
router.get('/', getAllDiseases);
router.post('/', createDisease);
router.put('/:id', updateDisease);
router.delete('/:id', deleteDisease);

export default router;
