import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  adminGetSubmissions,
  adminReviewSubmission,
  adminUpdateVerification,
} from '../services/submissionApi.js';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Send,
  Eye,
  Filter,
  Users,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAdmin, quickLoginAs } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [activeActionModal, setActiveActionModal] = useState(null); // { id, action: 'reject' | 'request_info' | 'publish' }
  const [reasonInput, setReasonInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Contributor Privileges state
  const [verifiedTargetUserId, setVerifiedTargetUserId] = useState('');
  const [verifiedStatus, setVerifiedStatus] = useState(true);
  const [verifiedCategories, setVerifiedCategories] = useState('Parks & Lakes, Religious Place');

  useEffect(() => {
    if (isAdmin) {
      loadSubmissions();
    }
  }, [isAdmin, filterStatus, filterCategory]);

  async function loadSubmissions() {
    setIsLoading(true);
    try {
      const res = await adminGetSubmissions({
        status: filterStatus,
        category: filterCategory,
      });
      setSubmissions(res.data || []);
      setPagination(res.pagination || {});
    } catch (err) {
      console.warn('Failed loading submissions:', err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAction = async (id, action) => {
    if (action === 'request_info' || action === 'reject') {
      setActiveActionModal({ id, action });
      setReasonInput('');
      return;
    }

    // Direct publish or approve
    try {
      await adminReviewSubmission(id, { action });
      setFeedback({ type: 'success', message: `Submission marked as '${action}'.` });
      loadSubmissions();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Moderation action failed.' });
    }
  };

  const handleConfirmActionWithReason = async () => {
    if (!reasonInput.trim()) {
      alert('Please provide a reason or instruction.');
      return;
    }

    try {
      await adminReviewSubmission(activeActionModal.id, {
        action: activeActionModal.action,
        reason: reasonInput.trim(),
      });
      setActiveActionModal(null);
      setReasonInput('');
      setFeedback({
        type: 'success',
        message: `Status updated to '${activeActionModal.action === 'request_info' ? 'needs_information' : 'rejected'}'.`,
      });
      loadSubmissions();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleGrantVerifiedPrivileges = async (e) => {
    e.preventDefault();
    if (!verifiedTargetUserId.trim()) return;

    try {
      const cats = verifiedCategories.split(',').map((c) => c.trim()).filter(Boolean);
      await adminUpdateVerification(verifiedTargetUserId.trim(), {
        isVerified: verifiedStatus,
        categories: cats,
      });
      setFeedback({
        type: 'success',
        message: `Successfully updated verification for user ${verifiedTargetUserId}.`,
      });
      setVerifiedTargetUserId('');
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed updating contributor role.' });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-stone-50 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-xs">
          <ShieldCheck className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-stone-900 mb-2">Civic Moderation Console</h2>
          <p className="text-sm text-stone-500 mb-6 leading-relaxed">
            This administrative console is restricted to HosurOne moderators and civic administrators.
          </p>
          <button
            onClick={() => quickLoginAs('admin')}
            className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm transition-colors"
          >
            Sign In with Administrator Credentials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      {/* Top Banner */}
      <section className="bg-emerald-950 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-emerald-900">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-900 border border-emerald-700 text-xs font-semibold text-emerald-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Administrative Verification Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Community Moderation & Registry Controls
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              Review incoming submissions, inspect proximity/duplicate warnings, and manage verified contributor categories.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-900/80 border border-emerald-700/60 px-3 py-1.5 rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">{user.name} (Admin)</span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between gap-3 border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <span className="text-sm font-semibold">{feedback.message}</span>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs underline hover:no-underline font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              Status:
            </div>
            {['all', 'pending', 'needs_information', 'published', 'rejected'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterStatus === st
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                {st === 'all' ? 'All Records' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Showing {submissions.length} submissions in review queue
          </div>
        </div>

        {/* Submissions Queue */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-sm text-stone-500">Loading moderation queue...</div>
          ) : submissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-sm text-stone-500">
              No submissions found matching the selected filter criteria.
            </div>
          ) : (
            submissions.map((sub) => {
              const subId = sub.id || sub._id;
              const isCorrection = sub.type === 'correction';

              return (
                <div
                  key={subId}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4"
                >
                  {/* Top line metadata */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isCorrection
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {isCorrection ? 'Correction Suggestion' : 'New Place'}
                        </span>
                        <h3 className="text-lg font-bold text-stone-900">{sub.name}</h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            sub.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : sub.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : sub.status === 'needs_information'
                              ? 'bg-orange-100 text-orange-800 border-orange-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {sub.status?.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                        <span>Category: <strong>{sub.category}</strong></span>
                        <span>•</span>
                        <span>Locality: <strong>{sub.locality}</strong></span>
                        <span>•</span>
                        <span>
                          Submitted by: <strong>{sub.submittedBy?.name || 'User'}</strong> ({sub.submittedBy?.role})
                        </span>
                        <span>•</span>
                        <span>{new Date(sub.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Coordinates readout */}
                    {sub.coordinates && (
                      <div className="text-xs font-mono text-stone-600 bg-stone-50 px-3 py-1 rounded-lg border border-stone-200">
                        {sub.coordinates.latitude?.toFixed(4)}° N, {sub.coordinates.longitude?.toFixed(4)}° E
                      </div>
                    )}
                  </div>

                  {/* Duplicate warning alert if nearby/existing listing was flagged */}
                  {sub.isDuplicateWarning && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>Duplicate Warning:</strong> A matching or nearby verified listing within 50 meters exists for this location. Verify whether this is a separate facility before publishing.
                      </span>
                    </div>
                  )}

                  {/* Submission Body */}
                  <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200 text-xs sm:text-sm space-y-2">
                    <p className="text-stone-800">
                      <strong>Address:</strong> {sub.address}
                    </p>
                    <p className="text-stone-700">
                      <strong>Description:</strong> {sub.description}
                    </p>
                    {sub.phone && (
                      <p className="text-stone-700">
                        <strong>Phone:</strong> {sub.phone}
                      </p>
                    )}
                    {sub.website && (
                      <p className="text-stone-700 flex items-center gap-1">
                        <strong>Website:</strong>{' '}
                        <a
                          href={sub.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          {sub.website} <ExternalLink className="w-3 h-3" />
                        </a>
                      </p>
                    )}
                    {sub.additionalInfo && (
                      <p className="text-stone-700">
                        <strong>Additional Notes / Clarifications:</strong> {sub.additionalInfo}
                      </p>
                    )}
                  </div>

                  {/* Moderation Actions Bar */}
                  <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-stone-500">
                      {sub.moderation?.reviewedBy && (
                        <span>Last reviewed by {sub.moderation.reviewedBy}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {sub.status !== 'published' && (
                        <button
                          type="button"
                          onClick={() => handleAction(subId, 'publish')}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Publish to Directory
                        </button>
                      )}

                      {sub.status === 'published' && (
                        <button
                          type="button"
                          onClick={() => handleAction(subId, 'unpublish')}
                          className="px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold transition-colors"
                        >
                          Unpublish
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAction(subId, 'request_info')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        Request Info
                      </button>

                      {sub.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleAction(subId, 'reject')}
                          className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal for Reject / Request Info Reason */}
        {activeActionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-stone-900">
                {activeActionModal.action === 'request_info'
                  ? 'Request Specific Information from Contributor'
                  : 'Rejection Reason'}
              </h3>
              <p className="text-xs text-stone-500">
                {activeActionModal.action === 'request_info'
                  ? 'Explain what details the contributor needs to clarify or verify (e.g. valid phone number, exact timings, physical landmark).'
                  : 'Specify why this submission is not eligible for publication in HosurOne.'}
              </p>
              <textarea
                rows={3}
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Type reason here..."
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveActionModal(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmActionWithReason}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contributor Privileges Manager Section */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">Manage Contributor Privileges</h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mb-6">
            Grant <strong>Verified Contributor</strong> status to trusted civic volunteers. Verified contributors can directly publish submissions for designated categories without prior moderation review.
          </p>

          <form onSubmit={handleGrantVerifiedPrivileges} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                User ID / Identifier
              </label>
              <input
                type="text"
                required
                value={verifiedTargetUserId}
                onChange={(e) => setVerifiedTargetUserId(e.target.value)}
                placeholder="e.g. user-contributor-01"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Permitted Categories (Comma Separated)
              </label>
              <input
                type="text"
                value={verifiedCategories}
                onChange={(e) => setVerifiedCategories(e.target.value)}
                placeholder="Parks & Lakes, Religious Place, ATMs"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              Update Contributor Role
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
