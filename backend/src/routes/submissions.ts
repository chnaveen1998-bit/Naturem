import { Router } from 'express';
import {
  getSubmissions,
  getSubmission,
  createSubmission,
  reviewSubmission,
} from '../controllers/submissionController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getSubmissions);
router.get('/:id', authenticate, getSubmission);
router.post('/', authenticate, createSubmission);
router.post('/:id/review', authenticate, requireAdmin, reviewSubmission);

export default router;
