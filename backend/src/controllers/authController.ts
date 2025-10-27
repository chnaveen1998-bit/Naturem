import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AuthService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, username, full_name } = req.body;

  const result = await AuthService.register({
    email,
    password,
    username,
    full_name,
  });

  res.status(201).json(result);
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const result = await AuthService.login(email, password);

  res.json(result);
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});
