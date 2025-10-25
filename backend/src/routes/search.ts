import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search remedies using BM25 and semantic search
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!query) {
      res.status(400).json({ error: 'Search query is required' });
    }

    // Simple text search implementation (can be enhanced with pg_trgm or full-text search)
    const searchPattern = `%${query}%`;
    const result = await pool.query(
      `SELECT r.*, u.username as author_name,
        ts_rank(to_tsvector('english', r.title || ' ' || r.description), plainto_tsquery('english', $1)) as rank
      FROM remedies r
      LEFT JOIN users u ON r.author_id = u.id
      WHERE to_tsvector('english', r.title || ' ' || r.description) @@ plainto_tsquery('english', $1)
        OR r.title ILIKE $2
        OR r.description ILIKE $2
      ORDER BY rank DESC, r.created_at DESC
      LIMIT $3`,
      [query, searchPattern, limit]
    );

    res.json({
      query,
      results: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
