import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Building,
  Search,
  MapPin,
  Phone,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Navigation,
  CheckCircle2,
  X,
  ArrowLeft,
  Info,
  CreditCard,
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import EmptyState from '../components/common/EmptyState';
import { fetchBankBranches } from '../services/bankApi';

export default function BankPage({ onOpenSuggest }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('q') || searchParams.get('search') || '';
  const initialBank = searchParams.get('bank') || 'all';
  const initialLocality = searchParams.get('locality') || 'all';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedBank, setSelectedBank] = useState(initialBank);
  const [selectedLocality, setSelectedLocality] = useState(initialLocality);

  const [branches, setBranches] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedIfsc, setCopiedIfsc] = useState(null);

  const bankOptions = [
    { id: 'all', label: 'All Banks' },
    { id: 'State Bank of India', label: 'State Bank of India (SBI)' },
    { id: 'Canara Bank', label: 'Canara Bank' },
    { id: 'Indian Bank', label: 'Indian Bank' },
    { id: 'HDFC Bank', label: 'HDFC Bank' },
    { id: 'ICICI Bank', label: 'ICICI Bank' },
    { id: 'Bank of Baroda', label: 'Bank of Baroda' },
    { id: 'Axis Bank', label: 'Axis Bank' },
    { id: 'Indian Overseas Bank', label: 'Indian Overseas Bank' },
    { id: 'Kotak Mahindra Bank', label: 'Kotak Mahindra Bank' },
  ];

  const localityOptions = [
    { id: 'all', label: 'All Localities' },
    { id: 'Hosur Main', label: 'Hosur Main Town' },
    { id: 'SIPCOT', label: 'SIPCOT Industrial Area' },
    { id: 'Bagalur', label: 'Bagalur' },
    { id: 'Mathigiri', label: 'Mathigiri' },
    { id: 'Kelamangalam', label: 'Kelamangalam' },
    { id: 'Denkanikottai', label: 'Denkanikottai' },
    { id: 'Shoolagiri', label: 'Shoolagiri' },
  ];

  const loadBranches = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const data = await fetchBankBranches({
        search: searchTerm,
        bank: selectedBank,
        locality: selectedLocality,
        limit: 30,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      setBranches(data.branches);
      setPagination(data.pagination);
    } catch (err) {
      clearTimeout(timeout);
      setError(err.message || 'Unable to load bank directory.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedBank, selectedLocality]);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const updateFilter = (bank, loc, search) => {
    const params = {};
    if (bank && bank !== 'all') params.bank = bank;
    if (loc && loc !== 'all') params.locality = loc;
    if (search && search.trim()) params.q = search.trim();
    setSearchParams(params, { replace: true });
  };

  const handleBankSelect = (bankId) => {
    setSelectedBank(bankId);
    updateFilter(bankId, selectedLocality, searchTerm);
  };

  const handleLocalitySelect = (locId) => {
    setSelectedLocality(locId);
    updateFilter(selectedBank, locId, searchTerm);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter(selectedBank, selectedLocality, searchTerm);
    loadBranches();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedBank('all');
    setSelectedLocality('all');
    setSearchParams({}, { replace: true });
  };

  const copyToClipboard = (ifsc) => {
    navigator.clipboard.writeText(ifsc);
    setCopiedIfsc(ifsc);
    setTimeout(() => {
      setCopiedIfsc(null);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/directory?category=banks"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-emerald-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Local Directory (Banks & ATMs)</span>
            </Link>
            <span className="text-stone-300">|</span>
            <Link
              to="/"
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
            >
              Home
            </Link>
          </div>

          {onOpenSuggest && (
            <button
              type="button"
              onClick={() => onOpenSuggest('place', 'Bank Branch')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer"
            >
              <span>Suggest Bank Branch</span>
            </button>
          )}
        </div>

        {/* Section Heading */}
        <SectionHeading
          badge="Hosur Financial Directory"
          title="Bank Branch & IFSC Finder"
          subtitle="Search verified commercial and public sector bank branches, official IFSC codes, and addresses across the Hosur industrial and residential belt."
        />

        {/* Notice: ATM Finder vs Branch Finder */}
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Bank Branch Finder:</strong> This directory covers verified physical branch locations and official IFSC codes for banking services. <em>Standalone ATM Finder will be released in an independent future phase.</em>
            </span>
          </div>
          <span className="text-amber-800 font-semibold shrink-0">Source: RBI IFSC Records</span>
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
                placeholder="Search by bank name, branch name, or IFSC code (e.g. SBIN0001928, SIPCOT, Canara)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 placeholder:text-stone-400 font-mono text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedBank}
                onChange={(e) => handleBankSelect(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 max-w-[160px] truncate"
                aria-label="Filter by bank"
              >
                {bankOptions.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocality}
                onChange={(e) => handleLocalitySelect(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 max-w-[150px] truncate"
                aria-label="Filter by locality"
              >
                {localityOptions.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.label}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-medium text-xs sm:text-sm hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                Search
              </button>

              {(searchTerm || selectedBank !== 'all' || selectedLocality !== 'all') && (
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
        </div>

        {/* Directory Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-60 rounded-2xl bg-white border border-stone-200 p-6 animate-pulse space-y-4">
                <div className="h-4 w-28 bg-stone-200 rounded" />
                <div className="h-6 w-3/4 bg-stone-200 rounded" />
                <div className="h-4 w-full bg-stone-200 rounded" />
                <div className="h-4 w-1/2 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            <p className="font-semibold">Unable to load bank directory</p>
            <p className="text-xs text-amber-800 mt-1">{error}</p>
          </div>
        ) : branches.length === 0 ? (
          <EmptyState
            icon={Building}
            badgeText="No Matching Branches"
            title="No bank branch found matching your search criteria"
            description="We could not find any verified bank branch with the selected bank, locality, or IFSC query. HosurOne only presents official, verified banking data. Try resetting filters."
            actionText="Reset All Filters"
            onAction={handleClearFilters}
            secondaryActionText="Suggest a Branch"
            onSecondaryAction={() => onOpenSuggest && onOpenSuggest('place', 'Bank Branch')}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>Showing {branches.length} verified bank branches in Hosur region</span>
              <span>Sourced from RBI Public IFSC records</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {branches.map((b) => {
                const mapsUrl = b.coordinates
                  ? `https://www.google.com/maps/search/?api=1&query=${b.coordinates.latitude},${b.coordinates.longitude}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.bankName + ' ' + b.branchName + ' ' + b.address)}`;

                const isCopied = copiedIfsc === b.ifsc;

                return (
                  <div
                    key={b.id || b._id}
                    className="rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 hover:border-emerald-700/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          {b.bankName}
                        </span>

                        <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          {b.locality}
                        </span>
                      </div>

                      {/* Branch Name */}
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-snug">
                          {b.branchName}
                        </h3>
                      </div>

                      {/* IFSC Box with Copy Button */}
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                            IFSC Code
                          </div>
                          <div className="font-mono font-bold text-sm sm:text-base text-stone-900 tracking-wider">
                            {b.ifsc}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(b.ifsc)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-800 text-white'
                              : 'bg-white hover:bg-stone-200/70 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Address */}
                      <div className="text-xs text-stone-600 flex items-start gap-2 pt-1">
                        <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{b.address}</span>
                      </div>

                      {/* Phone Contact */}
                      {b.phone && (
                        <div className="text-xs text-stone-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                          <a
                            href={`tel:${b.phone.replace(/[^\d+]/g, '')}`}
                            className="font-semibold text-emerald-900 hover:underline"
                          >
                            {b.phone}
                          </a>
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

                      {b.officialSource && (
                        <a
                          href={b.officialSource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors"
                        >
                          <span>Official Locator</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
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

