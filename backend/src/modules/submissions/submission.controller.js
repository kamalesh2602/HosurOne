import submissionService from './submission.service.js';

/**
 * POST /api/submissions
 * Create a new submission (new place or correction)
 * Requires authenticated Member, Verified Contributor, or Admin
 */
export async function create(req, res, next) {
  try {
    const payload = req.body;
    const user = req.user;

    const submission = await submissionService.createSubmission(payload, user);

    const message =
      submission.status === 'published'
        ? 'Your contribution was verified and published directly to the public directory!'
        : submission.isDuplicateWarning
        ? 'Contribution submitted for review. Note: A potential existing match or nearby record was detected.'
        : 'Thank you! Your contribution has been submitted for community moderation.';

    return res.status(201).json({
      success: true,
      message,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/submissions/mine
 * Get the current user's submission history
 */
export async function getMySubmissions(req, res, next) {
  try {
    const userId = req.user.id || req.user._id;
    const submissions = await submissionService.getUserSubmissions(userId);

    return res.status(200).json({
      success: true,
      data: submissions,
      meta: {
        total: submissions.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/submissions/:id
 * Get details of a single submission
 */
export async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const submission = await submissionService.getSubmissionById(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
      });
    }

    // Access check: published submissions are public; unpublished can only be seen by owner or admin
    const currentUserId = req.user ? (req.user.id || req.user._id) : null;
    const isAdmin = req.user && req.user.role === 'admin';
    const isOwner = currentUserId && submission.submittedBy?.id === currentUserId;

    if (submission.status !== 'published' && !isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this pending submission.',
      });
    }

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/submissions/:id
 * Update submission (owner providing more info or admin updating details)
 */
export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = req.user;

    const updated = await submissionService.updateSubmission(id, updates, user);

    return res.status(200).json({
      success: true,
      message: 'Submission updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  create,
  getMySubmissions,
  getById,
  update,
};
