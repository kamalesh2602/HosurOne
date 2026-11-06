import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, MapPin, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { createSubmission } from '../../services/submissionApi.js';

/**
 * SuggestModal component for community contributions and place recommendations
 */
export default function SuggestModal({
  isOpen,
  onClose,
  initialType = 'place', // 'place' | 'correction' | 'community' | 'contact'
  categoryHint = '',
}) {
  const { user, isLoggedIn, quickLoginAs } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    type: initialType === 'correction' ? 'correction' : 'new_place',
    category: categoryHint || 'Parks & Lakes',
    locality: 'Hosur City',
    description: '',
    addressOrContact: '',
    sourceUrl: '',
    submitterEmail: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (categoryHint) {
      setFormData((prev) => ({
        ...prev,
        category: categoryHint,
        type: initialType === 'correction' ? 'correction' : 'new_place',
      }));
    }
  }, [categoryHint, initialType]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSubmitted(false);
      setError('');
      setSuccessMessage('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please provide at least a title and a description.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // If not logged in, auto sign in as demo member or proceed with submission
      if (!isLoggedIn) {
        await quickLoginAs('member');
      }

      const res = await createSubmission({
        type: formData.type === 'correction' ? 'correction' : 'new_place',
        name: formData.title.trim(),
        targetListingName: formData.type === 'correction' ? formData.title.trim() : null,
        category: formData.category || 'Other Local Facilities',
        locality: formData.locality || 'Hosur City',
        address: formData.addressOrContact || `${formData.locality}, Hosur`,
        description: formData.description.trim(),
        sourceUrl: formData.sourceUrl || '',
      });

      setSuccessMessage(res.message || 'Contribution submitted successfully for moderation.');
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const localities = [
    'Hosur City (Central)',
    'Bagalur',
    'Kelamangalam',
    'Denkanikottai',
    'Shoolagiri',
    'Berigai',
    'Anchetty',
    'SIPCOT Phase 1 & 2',
    'Mookandapalli',
    'Mathigiri',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Contribution Received</h3>
            <p className="text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
              {successMessage || 'Thank you for contributing to HosurOne! Your suggestion will be reviewed by community moderators before publication.'}
            </p>
            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-900 transition-colors shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-emerald-800 tracking-wide uppercase">
                Community Verification Pipeline
              </span>
            </div>

            <h2 id="modal-title" className="text-xl font-bold text-stone-900 mb-1">
              {formData.type === 'correction' ? 'Suggest a Correction' : 'Suggest a Place or Update'}
            </h2>
            <p className="text-xs text-stone-500 mb-5 leading-relaxed">
              Help keep Hosur's regional database accurate. Every verified contribution benefits our whole community.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Place or Facility Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bagalur Primary Health Centre"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Locality / Taluk
                  </label>
                  <select
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {localities.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Healthcare, Lake, Park"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Description / Proposed Correction <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain what needs to be added or updated..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Address or Contact Info (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Street name, landmark, or contact phone"
                  value={formData.addressOrContact}
                  onChange={(e) => setFormData({ ...formData, addressOrContact: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Official Verification Source / URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://tn.gov.in/... or news source"
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {isLoggedIn ? `Posting as ${user.name}` : 'Will post as community contributor'}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
