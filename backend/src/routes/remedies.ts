import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/remedies:
 *   get:
 *     summary: Get all remedies
 *     tags: [Remedies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of remedies
 */
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT r.*, u.username as author_name FROM remedies r LEFT JOIN users u ON r.author_id = u.id ORDER BY r.created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM remedies');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching remedies:', error);
    res.status(500).json({ error: 'Failed to fetch remedies' });
      return;
  }
});

/**
 * @swagger
 * /api/remedies/{id}:
 *   get:
 *     summary: Get remedy by ID
 *     tags: [Remedies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Remedy details
 *       404:
 *         description: Remedy not found
 */
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT r.*, u.username as author_name FROM remedies r LEFT JOIN users u ON r.author_id = u.id WHERE r.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Remedy not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching remedy:', error);
    res.status(500).json({ error: 'Failed to fetch remedy' });
      return;
  }
});

/**
 * @swagger
 * /api/remedies:
 *   post:
 *     summary: Create a new remedy
 *     tags: [Remedies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: string
 *     responses:
 *       201:
 *         description: Remedy created
 */
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, ingredients, instructions, category } = req.body;
    const userId = req.userId;

    if (!title || !description) {
      res.status(400).json({ error: 'Title and description are required' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO remedies (title, description, ingredients, instructions, category, author_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, JSON.stringify(ingredients || []), instructions, category, userId, 'published']
    );

    res.status(201).json(result.rows[0]);
      return;
  } catch (error) {
    console.error('Error creating remedy:', error);
    res.status(500).json({ error: 'Failed to create remedy' });
      return;
  }
});

/**
 * @swagger
 * /api/remedies/{id}:
 *   put:
 *     summary: Update a remedy
 *     tags: [Remedies]
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Remedy updated
 */
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, ingredients, instructions, category } = req.body;
    const userId = req.userId;

    // Check if user owns the remedy or is admin
    const checkResult = await pool.query(
      'SELECT author_id FROM remedies WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Remedy not found' });
      return;
    }

    if (checkResult.rows[0].author_id !== userId && req.userRole !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const result = await pool.query(
      'UPDATE remedies SET title = COALESCE($1, title), description = COALESCE($2, description), ingredients = COALESCE($3, ingredients), instructions = COALESCE($4, instructions), category = COALESCE($5, category), updated_at = NOW() WHERE id = $6 RETURNING *',
      [title, description, ingredients ? JSON.stringify(ingredients) : null, instructions, category, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating remedy:', error);
    res.status(500).json({ error: 'Failed to update remedy' });
      return;
  }
});

/**
 * @swagger
 * /api/remedies/{id}:
 *   delete:
 *     summary: Delete a remedy
 *     tags: [Remedies]
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
 *         description: Remedy deleted
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Check if user owns the remedy or is admin
    const checkResult = await pool.query(
      'SELECT author_id FROM remedies WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Remedy not found' });
      return;
    }

    if (checkResult.rows[0].author_id !== userId && req.userRole !== 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await pool.query('DELETE FROM remedies WHERE id = $1', [id]);

    res.json({ message: 'Remedy deleted successfully' });
  } catch (error) {
    console.error('Error deleting remedy:', error);
    res.status(500).json({ error: 'Failed to delete remedy' });
      return;
  }
});

export default router;
