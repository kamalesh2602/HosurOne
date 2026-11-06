import { Router } from 'express';
import { create, getMySubmissions, getById, update } from './submission.controller.js';
import { authenticate, authorize, optionalAuthenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// POST /api/submissions - Submit a new place or correction
router.post('/', authenticate, authorize('member', 'verified_contributor', 'admin'), create);

// GET /api/submissions/mine - Get logged-in user's submissions
router.get('/mine', authenticate, getMySubmissions);

// GET /api/submissions/:id - Get specific submission details
router.get('/:id', optionalAuthenticate, getById);

// PATCH /api/submissions/:id - Update submission details
router.patch('/:id', authenticate, update);

export default router;
