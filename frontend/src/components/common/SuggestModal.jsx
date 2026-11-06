import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

/**
 * SuggestModal component for community contributions and place recommendations
 */
export default function SuggestModal({
  isOpen,
  onClose,
  initialType = 'place', // 'place' | 'community' | 'contact'
  categoryHint = '',
}) {
  const [formData, setFormData] = useState({
    title: '',
    type: initialType,
    category: categoryHint || '',
    locality: 'Hosur City',
    description: '',
    addressOrContact: '',
    sourceUrl: '',
    submitterEmail: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryHint) {
      setFormData((prev) => ({ ...prev, category: categoryHint, type: initialType }));
    }
  }, [categoryHint, initialType]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSubmitted(false);
      setError('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please provide at least a title and a description.');
      return;
    }
    setError('');
    // Store in localStorage or state to simulate local feedback without fake network calls
    try {
      const existing = JSON.parse(localStorage.getItem('hosurone_community_suggestions') || '[]');
      existing.push({
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending_moderation',
      });
      localStorage.setItem('hosurone_community_suggestions', JSON.stringify(existing));
    } catch {
      // Local storage may be restricted in some environments; ignore gracefully
    }
    setIsSubmitted(true);
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
    'Other Hosur Taluk Village',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2 text-emerald-800">
            <ShieldCheck className="w-5 h-5" />
            <h3 id="modal-title" className="font-semibold text-stone-900">
              {isSubmitted
                ? 'Submission Received'
                : formData.type === 'place'
                ? 'Suggest a Verified Place'
                : 'Submit Community Information'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold text-stone-900">Thank you for contributing!</h4>
              <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                Your suggestion for <strong>"{formData.title}"</strong> has been logged for community moderation. In accordance with HosurOne verification policy, listings are verified with local sources before appearing publicly.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-medium text-sm hover:bg-emerald-900 transition-colors cursor-pointer"
                >
                  Return to Portal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Regional Verification Policy
                </div>
                <p className="text-emerald-800/90 leading-relaxed">
                  HosurOne publishes verified regional data for Hosur, Bagalur, Kelamangalam, Denkanikottai, Shoolagiri, Berigai, and Anchetty. All submissions are verified prior to listing.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Name / Title of Place or Announcement <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Chandra Choodeswarar Temple or Hosur Taluk Office"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 placeholder:text-stone-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Locality / Region
                  </label>
                  <select
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900 bg-white"
                  >
                    {localities.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Parks, Transport, Public Service"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900 placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description & Key Information <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Provide verifiable details, landmarks, or working hours..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Address / Google Maps Link / Official Source (Optional)
                </label>
                <input
                  type="text"
                  placeholder="URL or landmark address for verification"
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Email (Optional, for verification clarification)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.submitterEmail}
                  onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900 placeholder:text-stone-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-stone-600 text-sm font-medium hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-sm font-medium hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

