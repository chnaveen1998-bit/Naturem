import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Apply admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const remediesCount = await pool.query('SELECT COUNT(*) FROM remedies');
    const submissionsCount = await pool.query('SELECT COUNT(*) FROM submissions WHERE status = $1', ['pending']);
    const postsCount = await pool.query('SELECT COUNT(*) FROM posts');

    res.json({
      users: parseInt(usersCount.rows[0].count),
      remedies: parseInt(remediesCount.rows[0].count),
      pendingSubmissions: parseInt(submissionsCount.rows[0].count),
      posts: parseInt(postsCount.rows[0].count),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', async (_req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, username, role, created_at FROM users ORDER BY created_at DESC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * @swagger
 * /api/admin/submissions:
 *   get:
 *     summary: Get all submissions (admin view)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all submissions
 */
router.get('/submissions', async (_req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT s.*, u.username FROM submissions s LEFT JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

/**
 * @swagger
 * /api/admin/submissions/{id}/approve:
 *   post:
 *     summary: Approve a submission
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Submission approved
 */
router.post('/submissions/:id/approve', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE submissions SET status = $1, updated_at = NOW() WHERE id = $2',
      ['approved', id]
    );

    res.json({ message: 'Submission approved' });
  } catch (error) {
    console.error('Error approving submission:', error);
    res.status(500).json({ error: 'Failed to approve submission' });
  }
});

/**
 * @swagger
 * /api/admin/submissions/{id}/reject:
 *   post:
 *     summary: Reject a submission
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Submission rejected
 */
router.post('/submissions/:id/reject', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE submissions SET status = $1, updated_at = NOW() WHERE id = $2',
      ['rejected', id]
    );

    res.json({ message: 'Submission rejected' });
  } catch (error) {
    console.error('Error rejecting submission:', error);
    res.status(500).json({ error: 'Failed to reject submission' });
  }
});

export default router;
