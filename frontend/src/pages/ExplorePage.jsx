import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  fetchAllDirectory,
  fetchPlaces,
  fetchHospitals,
  fetchAtms,
} from '../services/directoryApi.js';
import MapView from '../components/map/MapView.jsx';
import {
  Compass,
  MapPin,
  Search,
  Filter,
  Layers,
  Map,
  Grid,
  ExternalLink,
  Phone,
  ShieldCheck,
  Sparkles,
  Edit3,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Listings' },
  { id: 'Parks & Lakes', label: 'Parks & Lakes' },
  { id: 'Tourist Attraction', label: 'Tourist Attractions' },
  { id: 'Religious Place', label: 'Temples & Heritage' },
  { id: 'hospitals', label: 'Hospitals & Clinics' },
  { id: 'atms', label: '24/7 ATMs' },
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

export default function ExplorePage({ onOpenSuggest }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') || searchParams.get('category') || 'all';
  const matchedTab = CATEGORY_TABS.some((t) => t.id.toLowerCase() === tabParam.toLowerCase())
    ? CATEGORY_TABS.find((t) => t.id.toLowerCase() === tabParam.toLowerCase())?.id
    : 'all';

  const [activeTab, setActiveTab] = useState(matchedTab || 'all');
  const [locality, setLocality] = useState(searchParams.get('locality') || 'All Localities');
  const [search, setSearch] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync tab change from URL query params
  useEffect(() => {
    if (tabParam && matchedTab && matchedTab !== activeTab) {
      setActiveTab(matchedTab);
    }
  }, [tabParam]);

  useEffect(() => {
    loadDirectoryItems();
  }, [activeTab, locality, search]);

  async function loadDirectoryItems() {
    setIsLoading(true);
    try {
      const locFilter = locality === 'All Localities' ? '' : locality;
      let data = [];

      if (activeTab === 'all') {
        const res = await fetchAllDirectory({ search, locality: locFilter });
        data = res.items;
      } else if (activeTab === 'hospitals') {
        const res = await fetchHospitals({ search, locality: locFilter });
        data = res.items;
      } else if (activeTab === 'atms') {
        const res = await fetchAtms({ search, locality: locFilter });
        data = res.items;
      } else {
        const res = await fetchPlaces({ search, category: activeTab, locality: locFilter });
        data = res.items;
      }

      setItems(data);
    } catch (err) {
      console.warn('Failed loading directory:', err.message);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams);
    if (tabId === 'all') {
      params.delete('tab');
      params.delete('category');
    } else {
      params.set('tab', tabId);
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      {/* Hero Header */}
      <section className="bg-emerald-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-900 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-xs font-semibold text-emerald-300 mb-4">
            <Compass className="w-4 h-4 text-emerald-400" />
            Open Regional Directory & Interactive Map
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Explore Hosur & Surrounding Taluks
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base max-w-3xl leading-relaxed">
            Discover verified lakes, hill temples, cultural heritage sites, public healthcare centres, and essential facilities across Hosur, Kelamangalam, Bagalur, and Denkanikottai.
          </p>

          {/* Search bar inside hero */}
          <div className="mt-6 max-w-2xl relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search places by name, locality, landmark or description..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-stone-900 placeholder-stone-400 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Categories Tab Group */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Locality Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-stone-500 font-medium">Locality:</span>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle: Grid vs Map */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="OpenStreetMap View"
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Directory Count Bar */}
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span>Found <strong>{items.length}</strong> verified locations in Hosur region</span>
          <span>OpenStreetMap &copy; Leaflet Open Data</span>
        </div>

        {/* View Mode: Interactive OpenStreetMap */}
        {viewMode === 'map' && (
          <div className="space-y-4">
            <MapView items={items} height="560px" />
          </div>
        )}

        {/* View Mode: Card Grid */}
        {viewMode === 'grid' && (
          <div>
            {isLoading ? (
              <div className="text-center py-16 text-sm text-stone-500">Loading directory listings...</div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-sm text-stone-500">
                No locations found matching your criteria. Try adjusting the search term or category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                  const phoneNum = item.phone || item.contact;
                  const sourceLink = item.sourceUrl || item.officialSource || item.website;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-700/50 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {item.category}
                          </span>
                          <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                            {item.locality}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-xs text-stone-600 mt-2 leading-relaxed line-clamp-3">
                            {item.description || item.department}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1.5">
                          {/* Address */}
                          {item.address && (
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{item.address}</span>
                            </div>
                          )}

                          {/* Phone */}
                          {phoneNum && (
                            <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                              <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <a href={`tel:${phoneNum}`} className="hover:underline text-emerald-900">
                                {phoneNum}
                              </a>
                            </div>
                          )}

                          {/* Emergency Phone (if any) */}
                          {item.emergencyPhone && (
                            <div className="flex items-center gap-1.5 text-rose-700 font-medium text-[11px]">
                              <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                              <span>24/7 Casualty Emergency: <strong>{item.emergencyPhone}</strong></span>
                            </div>
                          )}

                          {/* Timings */}
                          {(item.timings || item.workingHours) && (
                            <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                              <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                              <span>{item.timings || item.workingHours}</span>
                            </div>
                          )}

                          {/* ATM Features */}
                          {item.category === 'ATM' && item.hasCashDeposit && (
                            <div className="inline-block mt-1">
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                Instant Cash Deposit (CDM)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                        {item.latitude && item.longitude ? (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                          >
                            Directions &rarr;
                          </a>
                        ) : sourceLink ? (
                          <a
                            href={sourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-emerald-800 hover:underline"
                          >
                            <span>Official Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-stone-400">Hosur Region</span>
                        )}

                        <button
                          type="button"
                          onClick={() => onOpenSuggest?.('correction', item.name)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-emerald-800 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          Suggest Correction
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
