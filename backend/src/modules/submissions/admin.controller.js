import submissionService from './submission.service.js';
import authService from '../auth/auth.service.js';

/**
 * GET /api/admin/submissions
 * Get list of submissions with status/category filters
 */
export async function getSubmissions(req, res, next) {
  try {
    const { status, category, page, limit } = req.query;
    const result = await submissionService.getAllSubmissionsAdmin({
      status,
      category,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result.submissions,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/submissions/:id/review
 * Moderation review: approve, publish, reject, request_info, unpublish
 */
export async function reviewSubmission(req, res, next) {
  try {
    const { id } = req.params;
    const { action, reason, edits } = req.body;
    const adminUser = req.user;

    const updated = await submissionService.reviewSubmissionAdmin(
      id,
      { action, reason, edits },
      adminUser
    );

    return res.status(200).json({
      success: true,
      message: `Submission status transitioned to '${updated.status}'.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/users/:id/verification
 * Grant or revoke verified contributor status and eligible categories
 */
export async function updateUserVerification(req, res, next) {
  try {
    const { id } = req.params;
    const { isVerified, categories } = req.body;

    const updatedUser = await authService.updateUserVerification(id, {
      isVerified,
      categories,
    });

    return res.status(200).json({
      success: true,
      message: isVerified
        ? 'User successfully promoted to Verified Contributor.'
        : 'User role returned to Member.',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/admin/users/:id/status
 * Activate or suspend a user account
 */
export async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedUser = await authService.updateUserStatus(id, status);

    return res.status(200).json({
      success: true,
      message: `User account is now '${status}'.`,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getSubmissions,
  reviewSubmission,
  updateUserVerification,
  updateUserStatus,
};

