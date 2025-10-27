import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';
import { RemedyModel } from '../models/Remedy';
import { SubmissionModel } from '../models/Submission';
import { asyncHandler } from '../utils/asyncHandler';
import { pool } from '../database/connection';

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const [usersCount, remediesCount, submissionsCount, pendingCount] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM users'),
    pool.query('SELECT COUNT(*) FROM remedies'),
    pool.query('SELECT COUNT(*) FROM submissions'),
    pool.query("SELECT COUNT(*) FROM submissions WHERE status = 'pending'"),
  ]);

  res.json({
    stats: {
      users: parseInt(usersCount.rows[0].count),
      remedies: parseInt(remediesCount.rows[0].count),
      submissions: parseInt(submissionsCount.rows[0].count),
      pendingSubmissions: parseInt(pendingCount.rows[0].count),
    },
  });
});

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { limit = 50, offset = 0 } = req.query;

  const users = await UserModel.findAll(Number(limit), Number(offset));

  res.json({ users, count: users.length });
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role, is_active } = req.body;

  const user = await UserModel.update(Number(id), {
    role,
    is_active,
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await UserModel.delete(Number(id));

  res.json({ message: 'User deleted successfully' });
});

export const getAllRemedies = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { limit = 50, offset = 0, status } = req.query;

  const remedies = await RemedyModel.findAll(
    Number(limit),
    Number(offset),
    { status: status as string }
  );

  res.json({ remedies, count: remedies.length });
});

export const updateRemedyStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, is_featured } = req.body;

  const remedy = await RemedyModel.update(Number(id), {
    status,
    is_featured,
  });

  if (!remedy) {
    return res.status(404).json({ error: 'Remedy not found' });
  }

  res.json({ remedy });
});

export const getAllSubmissions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { limit = 50, offset = 0, status } = req.query;

  const submissions = await SubmissionModel.findAll(
    Number(limit),
    Number(offset),
    { status: status as string }
  );

  res.json({ submissions, count: submissions.length });
});
