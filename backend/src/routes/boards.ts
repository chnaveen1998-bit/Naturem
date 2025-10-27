import { Router } from 'express';
import {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  addRemedyToBoard,
  removeRemedyFromBoard,
} from '../controllers/boardController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getBoards);
router.get('/:id', authenticate, getBoard);
router.post('/', authenticate, createBoard);
router.put('/:id', authenticate, updateBoard);
router.delete('/:id', authenticate, deleteBoard);
router.post('/:id/remedies/:remedyId', authenticate, addRemedyToBoard);
router.delete('/:id/remedies/:remedyId', authenticate, removeRemedyFromBoard);

export default router;
