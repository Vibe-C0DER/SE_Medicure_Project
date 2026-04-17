import express from 'express';
import { verifyAdmin } from '../../middlewares/auth.middleware.js';
import { createArticle, getAllArticles, updateArticle, deleteArticle } from '../../controllers/article.controller.js';

const router = express.Router();
router.use(verifyAdmin);
router.get('/', getAllArticles);
router.post('/', createArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);

export default router;
