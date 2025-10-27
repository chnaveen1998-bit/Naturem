import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { RemedyModel } from '../models/Remedy';
import { asyncHandler } from '../utils/asyncHandler';
import { searchService } from '../services/searchService';
import { pool } from '../database/connection';

export const getRemedies = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { limit = 50, offset = 0, status, category } = req.query;

  const remedies = await RemedyModel.findAll(
    Number(limit),
    Number(offset),
    {
      status: status as string,
      category: category as string,
    }
  );

  res.json({ remedies, count: remedies.length });
});

export const getRemedy = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const remedy = await RemedyModel.findById(Number(id));

  if (!remedy) {
    return res.status(404).json({ error: 'Remedy not found' });
  }

  // Increment views
  await RemedyModel.incrementViews(Number(id));

  res.json({ remedy });
});

export const createRemedy = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, ingredients, instructions, category, tags } = req.body;

  const remedy = await RemedyModel.create({
    title,
    description,
    ingredients,
    instructions,
    category,
    tags,
    author_id: req.user!.id,
    status: req.user!.role === 'admin' ? 'approved' : 'pending',
  });

  res.status(201).json({ remedy });
});

export const updateRemedy = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, ingredients, instructions, category, tags, status } = req.body;

  const existing = await RemedyModel.findById(Number(id));

  if (!existing) {
    return res.status(404).json({ error: 'Remedy not found' });
  }

  // Check authorization
  if (req.user!.role !== 'admin' && existing.author_id !== req.user!.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const remedy = await RemedyModel.update(Number(id), {
    title,
    description,
    ingredients,
    instructions,
    category,
    tags,
    status,
  });

  res.json({ remedy });
});

export const deleteRemedy = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await RemedyModel.findById(Number(id));

  if (!existing) {
    return res.status(404).json({ error: 'Remedy not found' });
  }

  // Check authorization
  if (req.user!.role !== 'admin' && existing.author_id !== req.user!.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await RemedyModel.delete(Number(id));

  res.json({ message: 'Remedy deleted successfully' });
});

export const searchRemedies = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { q, limit = 50 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  // Use PostgreSQL full-text search
  const remedies = await RemedyModel.search(q as string, Number(limit));

  res.json({ remedies, count: remedies.length });
});

export const likeRemedy = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const remedy = await RemedyModel.findById(Number(id));

  if (!remedy) {
    return res.status(404).json({ error: 'Remedy not found' });
  }

  // Check if already liked
  const existingLike = await pool.query(
    'SELECT * FROM remedy_likes WHERE user_id = $1 AND remedy_id = $2',
    [req.user!.id, id]
  );

  if (existingLike.rows.length > 0) {
    // Unlike
    await pool.query(
      'DELETE FROM remedy_likes WHERE user_id = $1 AND remedy_id = $2',
      [req.user!.id, id]
    );
    await pool.query('UPDATE remedies SET likes = likes - 1 WHERE id = $1', [id]);
    return res.json({ message: 'Remedy unliked' });
  } else {
    // Like
    await pool.query(
      'INSERT INTO remedy_likes (user_id, remedy_id) VALUES ($1, $2)',
      [req.user!.id, id]
    );
    await pool.query('UPDATE remedies SET likes = likes + 1 WHERE id = $1', [id]);
    return res.json({ message: 'Remedy liked' });
  }
});
