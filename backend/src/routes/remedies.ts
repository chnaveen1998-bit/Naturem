import { Router } from 'express';
import { body } from 'express-validator';
import {
  getRemedies,
  getRemedy,
  createRemedy,
  updateRemedy,
  deleteRemedy,
  searchRemedies,
  likeRemedy,
} from '../controllers/remedyController';
import { authenticate } from '../middleware/auth';
import { validate } from '../utils/validators';

const router = Router();

/**
 * @swagger
 * /api/remedies:
 *   get:
 *     summary: Get all remedies
 *     tags: [Remedies]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of remedies
 */
router.get('/', getRemedies);

/**
 * @swagger
 * /api/remedies/search:
 *   get:
 *     summary: Search remedies
 *     tags: [Remedies]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', searchRemedies);

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
 *           type: integer
 *     responses:
 *       200:
 *         description: Remedy details
 */
router.get('/:id', getRemedy);

/**
 * @swagger
 * /api/remedies:
 *   post:
 *     summary: Create new remedy
 *     tags: [Remedies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Remedy created
 */
router.post(
  '/',
  authenticate,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('ingredients').isArray().withMessage('Ingredients must be an array'),
    body('instructions').notEmpty().withMessage('Instructions are required'),
    validate,
  ],
  createRemedy
);

/**
 * @swagger
 * /api/remedies/{id}:
 *   put:
 *     summary: Update remedy
 *     tags: [Remedies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Remedy updated
 */
router.put('/:id', authenticate, updateRemedy);

/**
 * @swagger
 * /api/remedies/{id}:
 *   delete:
 *     summary: Delete remedy
 *     tags: [Remedies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Remedy deleted
 */
router.delete('/:id', authenticate, deleteRemedy);

/**
 * @swagger
 * /api/remedies/{id}/like:
 *   post:
 *     summary: Like/unlike remedy
 *     tags: [Remedies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Remedy liked/unliked
 */
router.post('/:id/like', authenticate, likeRemedy);

export default router;
