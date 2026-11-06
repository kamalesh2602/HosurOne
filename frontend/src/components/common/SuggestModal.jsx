import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, MapPin, Send, ExternalLink, BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { createSubmission } from '../../services/submissionApi.js';

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const GITHUB_REPO_URL = 'https://github.com/kamalesh2602/HosurOne';

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

      setSuccessMessage(
        res.message || 'Thank you! Your recommendation has been queued for volunteer verification.'
      );
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try submitting via GitHub issue templates.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const localities = [
    'Hosur City / Central',
    'SIPCOT Phase 1 & 2',
    'Mookandapalli',
    'Bagalur',
    'Mathigiri',
    'Kelamangalam',
    'Denkanikottai',
    'Shoolagiri',
    'Berigai',
    'Anchetty',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Recommendation Recorded</h3>
            <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
              {successMessage || 'Thank you for contributing! Our volunteer review team will verify the details against municipal ground truth before adding it to the public directory.'}
            </p>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-600 max-w-md mx-auto text-left space-y-1">
              <p className="font-semibold text-stone-800">Want to track your contribution directly?</p>
              <p>Check out our GitHub repository where you can submit directly to our JSON datasets or open an issue.</p>
              <a
                href={`${GITHUB_REPO_URL}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-800 font-semibold inline-flex items-center gap-1 hover:underline mt-1"
              >
                <span>Read CONTRIBUTING.md on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
              >
                Close
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
                Hosur Community Contributions
              </span>
            </div>

            <h2 id="modal-title" className="text-xl font-bold text-stone-900 mb-1">
              {formData.type === 'correction' ? 'Suggest a Listing Correction' : 'Submit Regional Place or Facility'}
            </h2>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Help keep Hosur's regional database accurate. We welcome contributions for healthcare, dining, banks, parks, and civic facilities.
            </p>

            {/* GitHub Primary Path Callout */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 mb-5 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center justify-between gap-2 font-semibold">
                <span className="flex items-center gap-1.5">
                  <GithubIcon className="w-4 h-4 text-emerald-800" />
                  Preferred: Contribute via GitHub
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Open Source
                </span>
              </div>
              <p className="text-emerald-900/90 leading-relaxed text-[11px]">
                You can submit new places or corrections directly through our structured GitHub Issue Forms without writing code, or edit JSON datasets directly via Pull Request.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`${GITHUB_REPO_URL}/issues/new/choose`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-900 transition-colors"
                >
                  <span>Submit via GitHub Form</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`${GITHUB_REPO_URL}/blob/main/CONTRIBUTING.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-semibold text-xs hover:bg-emerald-100 transition-colors"
                >
                  <BookOpen className="w-3 h-3 text-emerald-700" />
                  <span>Contributor Guide</span>
                </a>
              </div>
            </div>

            <div className="relative flex py-1 items-center mb-4">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Or Send Quick Note Here
              </span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Place or Facility Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Kelamangalam Upgraded PHC, or Ramanaicken Lake"
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
                    placeholder="e.g. Healthcare, Dining, Park, ATM"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Description / Details of Update <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="What services are offered, or what needs to be corrected? (Never invent details)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Address / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Street or nearby landmark"
                    value={formData.addressOrContact}
                    onChange={(e) => setFormData({ ...formData, addressOrContact: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Source / Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://... or Personal Visit"
                    value={formData.sourceUrl}
                    onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  Reviewed by volunteer maintainers
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Sending...' : 'Send Recommendation'}
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
