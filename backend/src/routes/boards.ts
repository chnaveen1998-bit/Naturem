import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/boards:
 *   get:
 *     summary: Get all boards
 *     tags: [Boards]
 *     responses:
 *       200:
 *         description: List of boards
 */
router.get('/', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM boards ORDER BY created_at DESC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

/**
 * @swagger
 * /api/boards/{id}:
 *   get:
 *     summary: Get board by ID with posts
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Board details with posts
 */
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const boardResult = await pool.query(
      'SELECT * FROM boards WHERE id = $1',
      [id]
    );

    if (boardResult.rows.length === 0) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    const postsResult = await pool.query(
      'SELECT p.*, u.username as author_name FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.board_id = $1 ORDER BY p.created_at DESC',
      [id]
    );

    res.json({
      board: boardResult.rows[0],
      posts: postsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

/**
 * @swagger
 * /api/boards/{id}/posts:
 *   post:
 *     summary: Create a new post in a board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created
 */
router.post('/:id/posts', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO posts (board_id, author_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, userId, title, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;
