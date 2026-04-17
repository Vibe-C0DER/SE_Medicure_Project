import express from 'express';
import { getAllArticles, getArticleByDiseaseId, getArticleById } from '../controllers/article.controller.js';

const router = express.Router();

router.get('/', getAllArticles);
router.get('/disease/:diseaseId', getArticleByDiseaseId);
router.get('/:id', getArticleById);

export default router;
