import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  ExternalLink,
  ShieldCheck,
  Clock,
  Navigation,
  HeartPulse,
  PhoneCall,
  CheckCircle2,
  Filter,
  X,
  ArrowLeft,
  Building,
  CreditCard,
  Landmark,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import EmptyState from '../components/common/EmptyState';
import { fetchLocalDirectory } from '../services/directoryApi.js';

const PRIMARY_CATEGORIES = [
  { id: 'all', label: 'All Services & Facilities' },
  { id: 'healthcare', label: 'Healthcare & Hospitals', icon: HeartPulse },
  { id: 'banks', label: 'Banks & ATMs', icon: Building },
  { id: 'government', label: 'Government & Civic', icon: Landmark },
  { id: 'helplines', label: 'Emergency Helplines', icon: PhoneCall },
];

const LOCALITIES = [
  'All Localities',
  'Hosur City',
  'Hosur Main',
  'SIPCOT',
  'Mookandapalli',
  'Bagalur',
  'Mathigiri',
  'Kelamangalam',
  'Denkanikottai',
  'Shoolagiri',
];

export default function LocalDirectoryPage({ onOpenSuggest }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('q') || searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialLocality = searchParams.get('locality') || 'All Localities';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocality, setSelectedLocality] = useState(initialLocality);

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDirectory = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const loc = selectedLocality === 'All Localities' ? '' : selectedLocality;
      const data = await fetchLocalDirectory({
        search: searchTerm,
        category: selectedCategory,
        locality: loc,
        limit: 50,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      setItems(data.items);
      setPagination(data.pagination);
    } catch (err) {
      clearTimeout(timeout);
      setError(err.message || 'Unable to load local directory.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedLocality]);

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  // Keep URL parameters synchronized
  const updateFilter = (cat, loc, search) => {
    const params = {};
    if (cat && cat !== 'all') params.category = cat;
    if (loc && loc !== 'All Localities') params.locality = loc;
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
    loadDirectory();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLocality('All Localities');
    setSearchParams({}, { replace: true });
  };

  return (
    <main className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top return link & contribution entry */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/contribute"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Contribute Info</span>
          </Link>
        </div>

        {/* Section Heading */}
        <SectionHeading
          badge="Verified Regional Directory"
          title="Hosur Local Directory"
          subtitle="Essential public services, healthcare facilities, bank branches, ATMs, and emergency contacts across Hosur, Bagalur, SIPCOT, and surrounding taluks."
        />

        {/* Search & Filter Controls Card */}
        <div className="rounded-2xl bg-white border border-stone-200 p-4 sm:p-6 shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by facility name, department, IFSC, address, or service (e.g. SBI, TNEB, Hospital)..."
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
                {LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-medium text-sm hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer"
              >
                Search
              </button>

              {(searchTerm || selectedCategory !== 'all' || selectedLocality !== 'All Localities') && (
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

          {/* Category Tabs: responsive pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-stone-100">
            {PRIMARY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                  }`}
                  aria-pressed={isSelected}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bank Finder Quick Link when Banks category is selected */}
          {selectedCategory === 'banks' && (
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-700" />
                <span>Need one-click IFSC copying and bank branch filtering?</span>
              </div>
              <Link
                to="/banks"
                className="font-semibold text-blue-800 hover:text-blue-950 inline-flex items-center gap-1 transition-colors"
              >
                <span>Open Dedicated Bank & IFSC Finder &rarr;</span>
              </Link>
            </div>
          )}
        </div>

        {/* Directory Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-60 rounded-2xl bg-white border border-stone-200 p-6 animate-pulse space-y-4">
                <div className="h-4 w-28 bg-stone-200 rounded" />
                <div className="h-6 w-3/4 bg-stone-200 rounded" />
                <div className="h-4 w-full bg-stone-200 rounded" />
                <div className="h-4 w-2/3 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            <p className="font-semibold">Unable to load directory records</p>
            <p className="text-xs text-amber-800 mt-1">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Building2}
            badgeText="No Matching Records"
            title="No directory listings found matching your search"
            description="We could not find any verified regional listings matching your filters. Try resetting your search terms, choosing 'All Services', or checking another locality."
            actionText="Reset All Filters"
            onAction={handleClearFilters}
            secondaryActionText="Contribute Missing Facility"
            onSecondaryAction={() => onOpenSuggest && onOpenSuggest('place', selectedCategory)}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>
                Showing <strong>{items.length}</strong> verified facilities & services across Hosur region
              </span>
              <span>All records independently attributed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => {
                const phoneNum = item.phone || item.contact || item.emergencyPhone;
                const mapsUrl = item.coordinates
                  ? `https://www.google.com/maps/search/?api=1&query=${item.coordinates.latitude},${item.coordinates.longitude}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + (item.address || ''))}`;

                const isBank = item.ifsc || item.category === 'Bank Branch' || item.bankName;
                const isAtm = item.category === 'ATM' || item.id?.startsWith('atm-');
                const isHospital = item.id?.startsWith('hosp-') || item.category?.toLowerCase().includes('hospital') || item.category?.toLowerCase().includes('phc') || item.category?.toLowerCase().includes('clinic');
                const isHelpline = item.id?.startsWith('cont-') || item.category?.toLowerCase().includes('helpline') || item.category?.toLowerCase().includes('emergency');

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-stone-200/90 bg-white p-5 hover:border-emerald-700/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isHospital
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : isBank || isAtm
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : isHelpline
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {item.category || 'Regional Facility'}
                        </span>

                        <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          {item.locality}
                        </span>
                      </div>

                      {/* Title & Department / Subtitle */}
                      <div>
                        <h3 className="text-base font-bold text-stone-900 tracking-tight leading-snug">
                          {item.name}
                        </h3>
                        {(item.department || item.description || item.bankName) && (
                          <p className="text-xs text-stone-500 mt-1 font-medium line-clamp-2">
                            {item.department || item.description}
                          </p>
                        )}
                      </div>

                      {/* Bank IFSC Metadata */}
                      {item.ifsc && (
                        <div className="flex items-center gap-2 text-xs bg-stone-50 border border-stone-200/80 rounded-lg px-2.5 py-1.5 text-stone-700">
                          <Building className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                          <span>IFSC: <strong className="text-blue-900 font-mono">{item.ifsc}</strong></span>
                        </div>
                      )}

                      {/* ATM Special Badges */}
                      {isAtm && (
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            24/7 Cash Withdrawal
                          </span>
                          {item.hasCashDeposit && (
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                              CDM Supported
                            </span>
                          )}
                        </div>
                      )}

                      {/* Address */}
                      {item.address && (
                        <div className="text-xs text-stone-600 flex items-start gap-2 pt-1">
                          <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item.address}</span>
                        </div>
                      )}

                      {/* Contact / Phone */}
                      {phoneNum && (
                        <div className="text-xs text-stone-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                          <a
                            href={`tel:${phoneNum.replace(/[^\d+]/g, '')}`}
                            className="font-semibold text-emerald-900 hover:underline"
                          >
                            {phoneNum}
                          </a>
                          {item.emergencyPhone && item.emergencyPhone !== phoneNum && (
                            <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                              Emergency: {item.emergencyPhone}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 hover:text-emerald-900 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Get Directions</span>
                      </a>

                      {item.sourceUrl || item.website ? (
                        <a
                          href={item.sourceUrl || item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-800 transition-colors"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-stone-400">Verified Listing</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
