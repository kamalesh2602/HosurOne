import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { createSubmission, getMySubmissions, updateSubmission } from '../services/submissionApi.js';
import LocationPicker from '../components/map/LocationPicker.jsx';
import {
  PlusCircle,
  Edit3,
  ListFilter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building2,
  MapPin,
  ExternalLink,
  Info,
  UserCheck,
  LogIn,
  Send,
} from 'lucide-react';

const CATEGORIES = [
  'Parks & Lakes',
  'Hospitals & Clinics',
  'Pharmacies',
  'ATMs',
  'Bank Branches',
  'Tourist Attractions',
  'Religious Places',
  'Bus Stops & Transport',
  'Government Offices',
  'Important Public Contacts',
  'Other Local Facilities',
];

const LOCALITIES = [
  'Hosur City',
  'SIPCOT',
  'Mookandapalli',
  'Bagalur',
  'Mathigiri',
  'Kelamangalam',
  'Denkanikottai',
  'Shoolagiri',
  'Berigai',
  'Anchetty',
];

export default function ContributePage() {
  const { user, isLoggedIn, isVerifiedContributor, isAdmin, quickLoginAs } = useAuth();
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'correction' | 'mine'

  // Submission Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Parks & Lakes',
    locality: 'Hosur City',
    address: '',
    description: '',
    phone: '',
    website: '',
    sourceUrl: '',
    additionalInfo: '',
    coordinates: { latitude: 12.7409, longitude: 77.8253 },
  });

  // Correction Form State
  const [correctionData, setCorrectionData] = useState({
    targetListingName: '',
    category: 'Parks & Lakes',
    locality: 'Hosur City',
    address: '',
    description: '',
    proposedChanges: '',
    sourceUrl: '',
    coordinates: { latitude: 12.7409, longitude: 77.8253 },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'warning' | 'error', message: '' }
  const [mySubmissions, setMySubmissions] = useState([]);
  const [isLoadingMine, setIsLoadingMine] = useState(false);

  // Edit State for Needs Information
  const [editingSub, setEditingSub] = useState(null);
  const [editNotes, setEditNotes] = useState('');

  // Load user submissions if logged in and tab is 'mine'
  useEffect(() => {
    if (isLoggedIn && activeTab === 'mine') {
      loadMySubmissions();
    }
  }, [isLoggedIn, activeTab]);

  async function loadMySubmissions() {
    setIsLoadingMine(true);
    try {
      const list = await getMySubmissions();
      setMySubmissions(list);
    } catch (err) {
      console.warn('Failed to load submissions:', err.message);
    } finally {
      setIsLoadingMine(false);
    }
  }

  const handleNewPlaceSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setFeedback({
        type: 'warning',
        message: 'Please sign in with a contributor or member account before submitting.',
      });
      return;
    }

    if (!formData.name.trim() || !formData.address.trim() || !formData.description.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please fill in all required fields (Name, Address, Description).',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await createSubmission({
        type: 'new_place',
        ...formData,
      });

      setFeedback({
        type: res.data?.status === 'published' ? 'success' : 'warning',
        message: res.message,
      });

      // Reset form
      setFormData({
        name: '',
        category: 'Parks & Lakes',
        locality: 'Hosur City',
        address: '',
        description: '',
        phone: '',
        website: '',
        sourceUrl: '',
        additionalInfo: '',
        coordinates: { latitude: 12.7409, longitude: 77.8253 },
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Submission failed. Please check inputs and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCorrectionSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setFeedback({
        type: 'warning',
        message: 'Please sign in with a member account to submit corrections.',
      });
      return;
    }

    if (!correctionData.targetListingName.trim() || !correctionData.proposedChanges.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please specify the facility name and details of proposed correction.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await createSubmission({
        type: 'correction',
        name: correctionData.targetListingName,
        targetListingName: correctionData.targetListingName,
        category: correctionData.category,
        locality: correctionData.locality,
        address: correctionData.address || 'Correction to existing record',
        description: `Proposed correction: ${correctionData.proposedChanges}`,
        additionalInfo: correctionData.proposedChanges,
        sourceUrl: correctionData.sourceUrl,
        coordinates: correctionData.coordinates,
      });

      setFeedback({
        type: 'success',
        message: res.message || 'Thank you! Your correction has been submitted for verification.',
      });

      setCorrectionData({
        targetListingName: '',
        category: 'Parks & Lakes',
        locality: 'Hosur City',
        address: '',
        description: '',
        proposedChanges: '',
        sourceUrl: '',
        coordinates: { latitude: 12.7409, longitude: 77.8253 },
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to submit correction.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveClarification = async (subId) => {
    if (!editNotes.trim()) return;
    try {
      await updateSubmission(subId, {
        additionalInfo: editNotes,
      });
      setEditingSub(null);
      setEditNotes('');
      loadMySubmissions();
      setFeedback({
        type: 'success',
        message: 'Information updated successfully! Submission returned to review queue.',
      });
    } catch (err) {
      alert(err.message || 'Failed to update submission');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      {/* Header Banner */}
      <section className="bg-emerald-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-900 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-xs font-semibold text-emerald-300 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Hosur Civic Contributor Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Community Contributions & Place Directory
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base max-w-3xl leading-relaxed">
            Help expand Hosur's regional public record. Add newly opened clinics, public facilities, ATMs, or landmarks, or submit verified corrections to existing directory listings.
          </p>

          {/* User Account / Role Quick Bar */}
          <div className="mt-6 pt-5 border-t border-emerald-900/80 flex flex-wrap items-center justify-between gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 bg-emerald-900/60 px-4 py-2 rounded-xl border border-emerald-700/50">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{user.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-600">
                      {user.role?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-300/80">{user.email} • {user.locality || 'Hosur'}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-200">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Guest mode. Sign in to contribute records or view your moderation history.</span>
              </div>
            )}

            {/* Quick Demo Switcher */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-300/80 text-[11px] font-medium">Quick Demo Role:</span>
              <button
                type="button"
                onClick={() => quickLoginAs('member')}
                className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-medium text-xs border border-emerald-600 transition-colors"
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => quickLoginAs('contributor')}
                className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-medium text-xs border border-emerald-600 transition-colors"
              >
                Verified
              </button>
              <button
                type="button"
                onClick={() => quickLoginAs('admin')}
                className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-medium text-xs border border-emerald-600 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-stone-200 gap-2 sm:gap-4 mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('new'); setFeedback(null); }}
            className={`pb-3 px-3 sm:px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'new'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Add New Place
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('correction'); setFeedback(null); }}
            className={`pb-3 px-3 sm:px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'correction'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Suggest Correction
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('mine'); setFeedback(null); }}
            className={`pb-3 px-3 sm:px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'mine'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            My Contributions {isLoggedIn && mySubmissions.length > 0 && `(${mySubmissions.length})`}
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : feedback.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-sm font-medium">{feedback.message}</div>
          </div>
        )}

        {/* TAB 1: ADD NEW PLACE */}
        {activeTab === 'new' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900">Add a New Facility or Landmark</h2>
              <p className="text-sm text-stone-500">
                Provide accurate, factual information. All contributions are vetted by community moderators before appearing in public listings.
              </p>
            </div>

            <form onSubmit={handleNewPlaceSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Facility / Place Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sanasandiram Community Clinic"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Locality / Region <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm bg-white"
                  >
                    {LOCALITIES.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 04344-245678"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Complete Physical Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street name, landmark, Hosur - pincode"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe public services provided, visiting procedures, landmark history, or key facilities available..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                />
              </div>

              {/* Map Location Picker */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Location Coordinates (OpenStreetMap)
                </label>
                <LocationPicker
                  value={formData.coordinates}
                  onChange={(coords) => setFormData({ ...formData, coordinates: coords })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Official Website or Reference URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Timings / Working Hours (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    placeholder="e.g. Mon–Sat 9:00 AM – 6:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div className="text-xs text-stone-500">
                  {isVerifiedContributor ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      Eligible categories will be published directly.
                    </span>
                  ) : (
                    <span>Submissions are screened against duplicate listings before approval.</span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Place for Review'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: SUGGEST A CORRECTION */}
        {activeTab === 'correction' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900">Suggest a Correction to an Existing Listing</h2>
              <p className="text-sm text-stone-500">
                Spotted outdated contact details, relocated facility, or incorrect hours? Help us maintain precision across HosurOne.
              </p>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Name of Existing Listing <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={correctionData.targetListingName}
                    onChange={(e) =>
                      setCorrectionData({ ...correctionData, targetListingName: e.target.value })
                    }
                    placeholder="e.g. Hosur District Headquarters Hospital"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={correctionData.category}
                    onChange={(e) =>
                      setCorrectionData({ ...correctionData, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Proposed Corrections & Updates <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={correctionData.proposedChanges}
                  onChange={(e) =>
                    setCorrectionData({ ...correctionData, proposedChanges: e.target.value })
                  }
                  placeholder="Detail the corrections needed: e.g. 'The hospital emergency number has updated to 04344-XXXXXX. Also, the outpatient counter operates from 8 AM instead of 9 AM.'"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Official Verification Source / URL (Optional)
                </label>
                <input
                  type="url"
                  value={correctionData.sourceUrl}
                  onChange={(e) =>
                    setCorrectionData({ ...correctionData, sourceUrl: e.target.value })
                  }
                  placeholder="Link to official notice, gazette, or municipal order"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Update Pin Coordinates (if place has moved or pin was inaccurate)
                </label>
                <LocationPicker
                  value={correctionData.coordinates}
                  onChange={(coords) =>
                    setCorrectionData({ ...correctionData, coordinates: coords })
                  }
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Correction Proposal'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: MY CONTRIBUTIONS */}
        {activeTab === 'mine' && (
          <div className="space-y-4">
            {!isLoggedIn ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
                <LogIn className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-800 mb-1">Sign in to view your history</h3>
                <p className="text-sm text-stone-500 mb-4 max-w-sm mx-auto">
                  Registered members can track the status of submitted places, view reviewer notes, and respond to clarification requests.
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => quickLoginAs('member')}
                    className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-900 transition-colors"
                  >
                    Demo Member Sign In
                  </button>
                </div>
              </div>
            ) : isLoadingMine ? (
              <div className="text-center py-12 text-sm text-stone-500">Loading your contributions...</div>
            ) : mySubmissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-sm text-stone-500">
                You haven't submitted any contributions yet. Switch to "Add New Place" to submit a listing!
              </div>
            ) : (
              mySubmissions.map((sub) => {
                const subId = sub.id || sub._id;
                const statusStyles = {
                  published: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                  approved: 'bg-teal-100 text-teal-800 border-teal-300',
                  pending: 'bg-amber-100 text-amber-800 border-amber-300',
                  needs_information: 'bg-orange-100 text-orange-800 border-orange-300',
                  rejected: 'bg-rose-100 text-rose-800 border-rose-300',
                  unpublished: 'bg-stone-100 text-stone-700 border-stone-300',
                };

                return (
                  <div
                    key={subId}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-stone-900 text-base">{sub.name}</h3>
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              statusStyles[sub.status] || 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {sub.status?.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {sub.category} • {sub.locality} • Submitted on {new Date(sub.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {sub.coordinates && (
                        <div className="text-[11px] font-mono text-stone-500 bg-stone-50 px-2.5 py-1 rounded-md border border-stone-200">
                          {sub.coordinates.latitude?.toFixed(4)}° N, {sub.coordinates.longitude?.toFixed(4)}° E
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-stone-700">{sub.description}</p>

                    {/* Moderation Notes / Feedback */}
                    {sub.moderation?.feedbackReason && (
                      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                        <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          Reviewer Feedback ({sub.moderation.reviewedBy || 'Moderator'}):
                        </div>
                        <p>{sub.moderation.feedbackReason}</p>
                      </div>
                    )}

                    {/* Clarification prompt if needs_information */}
                    {sub.status === 'needs_information' && (
                      <div className="pt-2">
                        {editingSub === subId ? (
                          <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                            <label className="block text-xs font-bold text-stone-700">
                              Provide Requested Additional Information:
                            </label>
                            <textarea
                              rows={3}
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              placeholder="Type required details here to respond to the reviewer..."
                              className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setEditingSub(null)}
                                className="px-3 py-1 rounded text-xs text-stone-600 hover:bg-stone-200"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveClarification(subId)}
                                className="px-3 py-1 rounded bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900"
                              >
                                Submit Update
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSub(subId);
                              setEditNotes(sub.additionalInfo || '');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Provide Requested Details
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
