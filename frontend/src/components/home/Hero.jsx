import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building2, Bus, HeartPulse, ArrowRight, Compass } from 'lucide-react';

export default function Hero({ onOpenSuggest }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleQuickTagClick = (item) => {
    setSearchQuery(item.query);
    if (item.target === 'directory') {
      navigate(`/directory?q=${encodeURIComponent(item.query)}`);
    } else {
      navigate(`/explore?q=${encodeURIComponent(item.query)}`);
    }
  };

  const popularSearches = [
    { label: 'Taluk Office', query: 'Taluk Office', icon: Building2, target: 'directory' },
    { label: 'Government Hospital', query: 'Government Hospital', icon: HeartPulse, target: 'directory' },
    { label: 'E-Sevai Centre', query: 'E-Sevai', icon: Building2, target: 'directory' },
    { label: 'SIPCOT Banks & ATMs', query: 'SIPCOT', icon: MapPin, target: 'directory' },
    { label: 'Hill Temples & Lakes', query: 'Temple', icon: Compass, target: 'explore' },
  ];

  return (
    <section className="relative overflow-hidden bg-stone-50 border-b border-stone-200/80 pt-10 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      {/* Subtle regional atmospheric background accents */}
      <div
        className="absolute top-0 right-1/4 -z-10 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/3 -z-10 w-80 h-80 rounded-full bg-amber-100/30 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Regional Identity Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold tracking-wide shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
            <span>Krishnagiri District, Tamil Nadu • Civic Information Hub</span>
          </div>

          {/* Primary Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12]">
            Everything Hosur, <br />
            <span className="text-emerald-800">in One Place.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg lg:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Discover places, access public services, explore opportunities and stay connected with everything happening across the Hosur region.
          </p>

          {/* Prominent Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-white rounded-2xl shadow-sm border border-stone-300/80 hover:border-emerald-700 focus-within:border-emerald-700 focus-within:ring-4 focus-within:ring-emerald-700/10 transition-all p-1.5 sm:p-2"
              role="search"
            >
              <div className="pl-3 pr-2 text-stone-400 flex items-center">
                <Search className="w-5 h-5 text-emerald-800" aria-hidden="true" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search places, bus stands, government offices, services..."
                className="w-full bg-transparent border-none text-stone-900 placeholder:text-stone-400 text-sm sm:text-base focus:outline-none py-2 px-1"
                aria-label="Search HosurOne portal"
              />

              <button
                type="submit"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-sm transition-colors shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline" />
              </button>
            </form>

            {/* Popular Search Quick Tags */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
              <span className="text-stone-500 font-medium mr-1">Frequent Searches:</span>
              {popularSearches.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleQuickTagClick(item)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-emerald-900 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                >
                  <item.icon className="w-3 h-3 text-emerald-700" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Regional localities banner */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500">
            <span className="font-medium text-stone-600">Regional coverage:</span>
            <span className="text-stone-700 font-semibold">Hosur City</span>
            <span>•</span>
            <span className="text-stone-700 font-semibold">Bagalur</span>
            <span>•</span>
            <span className="text-stone-700 font-semibold">Kelamangalam</span>
            <span>•</span>
            <span className="text-stone-700 font-semibold">Denkanikottai</span>
            <span>•</span>
            <span className="text-stone-700 font-semibold">Shoolagiri</span>
            <span>•</span>
            <span className="text-stone-700 font-semibold">Berigai</span>
            <span>•</span>
            <span className="text-stone-700 font-semibold">Anchetty</span>
          </div>
        </div>
      </div>
    </section>
  );
}

