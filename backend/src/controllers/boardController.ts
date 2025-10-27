import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { BoardModel } from '../models/Board';
import { asyncHandler } from '../utils/asyncHandler';

export const getBoards = asyncHandler(async (req: AuthRequest, res: Response) => {
  const boards = await BoardModel.findByUserId(req.user!.id);

  res.json({ boards, count: boards.length });
});

export const getBoard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const board = await BoardModel.findById(Number(id));

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  // Check authorization
  if (board.user_id !== req.user!.id && !board.is_public) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const remedies = await BoardModel.getRemedies(Number(id));

  res.json({ board, remedies });
});

export const createBoard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description, is_public } = req.body;

  const board = await BoardModel.create({
    user_id: req.user!.id,
    name,
    description,
    is_public,
  });

  res.status(201).json({ board });
});

export const updateBoard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, is_public } = req.body;

  const existing = await BoardModel.findById(Number(id));

  if (!existing) {
    return res.status(404).json({ error: 'Board not found' });
  }

  // Check authorization
  if (existing.user_id !== req.user!.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const board = await BoardModel.update(Number(id), {
    name,
    description,
    is_public,
  });

  res.json({ board });
});

export const deleteBoard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await BoardModel.findById(Number(id));

  if (!existing) {
    return res.status(404).json({ error: 'Board not found' });
  }

  // Check authorization
  if (existing.user_id !== req.user!.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await BoardModel.delete(Number(id));

  res.json({ message: 'Board deleted successfully' });
});

export const addRemedyToBoard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, remedyId } = req.params;

  const board = await BoardModel.findById(Number(id));

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  // Check authorization
  if (board.user_id !== req.user!.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await BoardModel.addRemedy(Number(id), Number(remedyId));

  res.json({ message: 'Remedy added to board' });
});

export const removeRemedyFromBoard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, remedyId } = req.params;

  const board = await BoardModel.findById(Number(id));

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  // Check authorization
  if (board.user_id !== req.user!.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await BoardModel.removeRemedy(Number(id), Number(remedyId));

  res.json({ message: 'Remedy removed from board' });
});
