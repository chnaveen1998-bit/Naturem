import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SubmissionModel } from '../models/Submission';
import { RemedyModel } from '../models/Remedy';
import { asyncHandler } from '../utils/asyncHandler';

export const getSubmissions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { limit = 50, offset = 0, status } = req.query;

  const filters: any = {};
  if (status) filters.status = status;

  // Users can only see their own submissions, admins see all
  if (req.user!.role !== 'admin') {
    filters.user_id = req.user!.id;
  }

  const submissions = await SubmissionModel.findAll(
    Number(limit),
    Number(offset),
    filters
  );

  res.json({ submissions, count: submissions.length });
});

export const getSubmission = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const submission = await SubmissionModel.findById(Number(id));

  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  // Check authorization
  if (req.user!.role !== 'admin' && submission.user_id !== req.user!.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  res.json({ submission });
});

export const createSubmission = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, ingredients, instructions, category, tags } = req.body;

  const submission = await SubmissionModel.create({
    user_id: req.user!.id,
    title,
    description,
    ingredients,
    instructions,
    category,
    tags,
  });

  res.status(201).json({ submission });
});

export const reviewSubmission = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  const submission = await SubmissionModel.findById(Number(id));

  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  // Update submission status
  const updated = await SubmissionModel.update(Number(id), {
    status,
    admin_notes,
    reviewed_at: new Date(),
    reviewed_by: req.user!.id,
  });

  // If approved, create remedy
  if (status === 'approved') {
    const remedy = await RemedyModel.create({
      title: submission.title,
      description: submission.description,
      ingredients: submission.ingredients,
      instructions: submission.instructions,
      category: submission.category,
      tags: submission.tags,
      author_id: submission.user_id,
      status: 'approved',
    });

    await SubmissionModel.update(Number(id), {
      remedy_id: remedy.id,
    });
  }

  res.json({ submission: updated });
});
