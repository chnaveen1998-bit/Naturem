import { Router } from 'express';
import {
  getStats,
  getUsers,
  updateUser,
  deleteUser,
  getAllRemedies,
  updateRemedyStatus,
  getAllSubmissions,
} from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/remedies', getAllRemedies);
router.put('/remedies/:id', updateRemedyStatus);
router.get('/submissions', getAllSubmissions);

export default router;
