import express from 'express';
import { createContactMessage } from '../controllers/contact.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// The user specified "make sure it is proctected route only logged in user can access"
// in PART 1 - USER CONTACT PAGE.
router.post('/', verifyToken, createContactMessage);

export default router;
