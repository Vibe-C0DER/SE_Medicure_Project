import express from 'express';
import { verifyAdmin } from '../../middlewares/auth.middleware.js';
import {
  getAllContactMessages,
  markMessageAsRead,
  deleteMessage,
} from '../../controllers/contact.controller.js';

const router = express.Router();

router.use(verifyAdmin);

router.get('/', getAllContactMessages);
router.put('/:id/read', markMessageAsRead);
router.delete('/:id', deleteMessage);

export default router;
