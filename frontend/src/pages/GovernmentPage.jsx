import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Landmark,
  Search,
  MapPin,
  Phone,
  ExternalLink,
  ShieldCheck,
  Clock,
  Navigation,
  Building2,
  HeartPulse,
  PhoneCall,
  CheckCircle2,
  Filter,
  X,
  ArrowLeft,
  Info,
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import EmptyState from '../components/common/EmptyState';
import { fetchGovernmentOffices } from '../services/governmentApi';

export default function GovernmentPage({ onOpenSuggest }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('q') || searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialLocality = searchParams.get('locality') || 'all';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocality, setSelectedLocality] = useState(initialLocality);

  const [offices, setOffices] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModalOffice, setActiveModalOffice] = useState(null);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'Municipal Corporation', label: 'Municipal Corporation' },
    { id: 'Taluk & Revenue', label: 'Taluk & Revenue' },
    { id: 'Hospital', label: 'Hospitals & Health' },
    { id: 'Police Station', label: 'Police Stations' },
    { id: 'Transport & RTO', label: 'RTO & Transport' },
    { id: 'Post Office', label: 'Post Offices' },
    { id: 'Electricity Office', label: 'Electricity (TNEB)' },
    { id: 'E-Sevai Centre', label: 'E-Sevai Centres' },
    { id: 'Helpline', label: 'Emergency Helplines' },
  ];

  const localities = [
    { id: 'all', label: 'All Localities' },
    { id: 'Hosur City', label: 'Hosur City' },
    { id: 'Bagalur', label: 'Bagalur' },
    { id: 'Kelamangalam', label: 'Kelamangalam' },
    { id: 'Denkanikottai', label: 'Denkanikottai' },
    { id: 'Shoolagiri', label: 'Shoolagiri' },
  ];

  const loadOffices = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const data = await fetchGovernmentOffices({
        search: searchTerm,
        category: selectedCategory,
        locality: selectedLocality,
        limit: 30,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      setOffices(data.offices);
      setPagination(data.pagination);
    } catch (err) {
      clearTimeout(timeout);
      setError(err.message || 'Unable to load government directory.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedLocality]);

  useEffect(() => {
    loadOffices();
  }, [loadOffices]);

  // Keep URL parameters in sync
  const updateFilter = (cat, loc, search) => {
    const params = {};
    if (cat && cat !== 'all') params.category = cat;
    if (loc && loc !== 'all') params.locality = loc;
    if (search && search.trim()) params.q = search.trim();
    setSearchParams(params, { replace: true });
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    updateFilter(catId, selectedLocality, searchTerm);
  };

  const handleLocalitySelect = (locId) => {
    setSelectedLocality(locId);
    updateFilter(selectedCategory, locId, searchTerm);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter(selectedCategory, selectedLocality, searchTerm);
    loadOffices();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLocality('all');
    setSearchParams({}, { replace: true });
  };

  return (
    <main className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          {onOpenSuggest && (
            <button
              type="button"
              onClick={() => onOpenSuggest('place', 'Government Office')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer"
            >
              <span>Submit Office Correction</span>
            </button>
          )}
        </div>

        {/* Section Heading */}
        <SectionHeading
          badge="Verified Civic Directory"
          title="Government & Public Services Directory"
          subtitle="Official administrative offices, emergency helplines, municipal departments, and health centres across the Hosur region with verified addresses and official sources."
        />

        {/* Source Attribution Notice */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 text-xs text-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Official Data Sources:</strong> Information compiled and verified against public records from the{' '}
              <a
                href="https://www.tnurbantree.tn.gov.in/hosur/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-800 font-semibold underline"
              >
                Hosur City Municipal Corporation
              </a>
              , Krishnagiri District Administration, and Tamil Nadu Government Departments.
            </span>
          </div>
          <span className="text-stone-400 shrink-0">Updated: Nov 2026</span>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-2xl bg-white border border-stone-200 p-4 sm:p-6 shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by office name, department, address, or service (e.g. Patta, FIR, Water)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 placeholder:text-stone-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedLocality}
                onChange={(e) => handleLocalitySelect(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                aria-label="Filter by locality"
              >
                {localities.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.label}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-medium text-sm hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer"
              >
                Search
              </button>

              {(searchTerm || selectedCategory !== 'all' || selectedLocality !== 'all') && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Clear all filters"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-stone-100">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                  }`}
                  aria-pressed={isSelected}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white border border-stone-200 p-6 animate-pulse space-y-4">
                <div className="h-4 w-28 bg-stone-200 rounded" />
                <div className="h-6 w-3/4 bg-stone-200 rounded" />
                <div className="h-4 w-full bg-stone-200 rounded" />
                <div className="h-4 w-2/3 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            <p className="font-semibold">Unable to load government directory</p>
            <p className="text-xs text-amber-800 mt-1">{error}</p>
          </div>
        ) : offices.length === 0 ? (
          <EmptyState
            icon={Landmark}
            badgeText="No Matching Records"
            title="No verified government offices found matching your criteria"
            description="We could not find any official government listing matching your search terms. HosurOne only displays verified public records. Try resetting your search filters or suggest an office for verification."
            actionText="Reset All Filters"
            onAction={handleClearFilters}
            secondaryActionText="Suggest an Office"
            onSecondaryAction={() => onOpenSuggest && onOpenSuggest('place', 'Government Office')}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>Showing {offices.length} verified listings in Hosur region</span>
              <span>All records officially attributed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offices.map((office) => {
                const mapsUrl = office.coordinates
                  ? `https://www.google.com/maps/search/?api=1&query=${office.coordinates.latitude},${office.coordinates.longitude}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.name + ' ' + office.address)}`;

                return (
                  <div
                    key={office.id || office._id}
                    className="rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 hover:border-emerald-700/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          {office.category}
                        </span>

                        <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          {office.locality}
                        </span>
                      </div>

                      {/* Title & Department */}
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-snug">
                          {office.name}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1 font-medium">
                          {office.department}
                        </p>
                      </div>

                      {/* Address */}
                      <div className="text-xs text-stone-600 flex items-start gap-2 pt-1">
                        <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{office.address}</span>
                      </div>

                      {/* Contact Number */}
                      {office.contact && (
                        <div className="text-xs text-stone-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                          <a
                            href={`tel:${office.contact.replace(/[^\d+]/g, '')}`}
                            className="font-semibold text-emerald-900 hover:underline"
                          >
                            {office.contact}
                          </a>
                        </div>
                      )}

                      {/* Services Snippet */}
                      {office.servicesOffered && office.servicesOffered.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1">
                          {office.servicesOffered.slice(0, 3).map((svc, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium"
                            >
                              {svc}
                            </span>
                          ))}
                          {office.servicesOffered.length > 3 && (
                            <button
                              type="button"
                              onClick={() => setActiveModalOffice(office)}
                              className="text-[10px] px-1.5 py-0.5 rounded text-emerald-800 font-semibold hover:underline cursor-pointer"
                            >
                              +{office.servicesOffered.length - 3} more
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-900 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Directions</span>
                      </a>

                      <div className="flex items-center gap-2">
                        {office.sourceUrl && (
                          <a
                            href={office.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                            title="Official Verification Source"
                            aria-label="Official Verification Source"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setActiveModalOffice(office)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Office Detail Modal */}
        {activeModalOffice && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Landmark className="w-5 h-5" />
                  <h3 className="font-bold text-stone-900">Office Details</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalOffice(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-sm">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {activeModalOffice.category}
                  </span>
                  <h4 className="text-xl font-bold text-stone-900 mt-2">{activeModalOffice.name}</h4>
                  <p className="text-xs text-stone-500">{activeModalOffice.department}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs sm:text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Address:</strong> {activeModalOffice.address}</span>
                  </div>

                  {activeModalOffice.contact && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span><strong>Contact:</strong> <a href={`tel:${activeModalOffice.contact}`} className="text-emerald-800 underline">{activeModalOffice.contact}</a></span>
                    </div>
                  )}

                  {activeModalOffice.workingHours && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span><strong>Working Hours:</strong> {activeModalOffice.workingHours}</span>
                    </div>
                  )}
                </div>

                {activeModalOffice.servicesOffered && activeModalOffice.servicesOffered.length > 0 && (
                  <div className="pt-2 border-t border-stone-100">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-stone-700 mb-2">Available Public Services</h5>
                    <ul className="space-y-1.5 text-xs text-stone-600">
                      {activeModalOffice.servicesOffered.map((svc, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{svc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Last Verified: {activeModalOffice.lastVerified}</span>
                  {activeModalOffice.sourceUrl && (
                    <a
                      href={activeModalOffice.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-800 underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Official Source Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="px-6 py-3 border-t border-stone-100 bg-stone-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModalOffice(null)}
                  className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 text-xs font-semibold hover:bg-stone-300 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

