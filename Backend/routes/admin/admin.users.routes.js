import express from 'express';
import { verifyAdmin } from '../../middlewares/auth.middleware.js';
import { getAllUsers, updateUserRole, updateUserStatus, deleteUser } from '../../controllers/admin.users.controller.js';

const router = express.Router();
router.use(verifyAdmin);

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', updateUserStatus);
router.delete('/:id', deleteUser);

export default router;
