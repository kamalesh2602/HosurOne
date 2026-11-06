import { Router } from 'express';
import {
  getSubmissions,
  reviewSubmission,
  updateUserVerification,
  updateUserStatus,
} from './admin.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Protect all admin routes with authentication and admin role authorization
router.use(authenticate, authorize('admin'));

// GET /api/admin/submissions - List all submissions with filters
router.get('/submissions', getSubmissions);

// PATCH /api/admin/submissions/:id/review - Review submission (approve, publish, reject, request_info, unpublish)
router.patch('/submissions/:id/review', reviewSubmission);

// PATCH /api/admin/users/:id/verification - Manage verified contributor privileges
router.patch('/users/:id/verification', updateUserVerification);

// PATCH /api/admin/users/:id/status - Manage user account status
router.patch('/users/:id/status', updateUserStatus);

export default router;

