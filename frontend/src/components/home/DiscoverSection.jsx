import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Utensils,
  ShoppingBag,
  Trees,
  Landmark,
  Compass,
  MapPin,
  ExternalLink,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import { fetchPlaces } from '../../services/directoryApi';

export default function DiscoverSection({ onOpenSuggest }) {
  const categories = [
    {
      id: 'tourist',
      name: 'Tourist attractions',
      categoryQuery: 'Tourist',
      icon: Camera,
      description: 'Historical forts, scenic viewpoints, reservoirs, and cultural heritage across Hosur and nearby taluks.',
      coverageScope: 'Chandrachoodeswarar Hill Temple, Rajaji Memorial, Thally Little England, Kelavarapalli Dam',
    },
    {
      id: 'parks',
      name: 'Parks and recreation',
      categoryQuery: 'Parks',
      icon: Trees,
      description: 'Public parks, municipal gardens, recreational lakes, walking trails, and eco-tourism spots.',
      coverageScope: 'Ramanaicken Lake promenade, Eco Park, and municipal children’s parks',
    },
    {
      id: 'religious',
      name: 'Religious places',
      categoryQuery: 'Religious',
      icon: Landmark,
      description: 'Ancient temples, historic churches, and mosques representing the diverse heritage of the region.',
      coverageScope: 'Chandra Choodeswarar hill temple, Betrayaswamy temple, and heritage shrines',
    },
    {
      id: 'food',
      name: 'Food and dining',
      categoryQuery: 'Food',
      icon: Utensils,
      description: 'Traditional Tamil Nadu messes, regional breakfast spots, highway diners, and local eateries.',
      coverageScope: 'Hosur City, Bagalur Road, Rayakottah Road, and NH44 Highway corridor',
    },
    {
      id: 'shopping',
      name: 'Shopping and markets',
      categoryQuery: 'Shopping',
      icon: ShoppingBag,
      description: 'Local bazaars, weekly farmers markets (Santha), handlooms, silk centres, and shopping complexes.',
      coverageScope: 'MG Road, Gandhi Statue Market, weekly Sunday markets, and cooperative handloom outlets',
    },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const ActiveIcon = activeCategory?.icon || Compass;

  useEffect(() => {
    let mounted = true;
    async function loadDirectoryPlaces() {
      try {
        const res = await fetchPlaces({ limit: 50 });
        if (mounted) {
          setAllPlaces(res.items || []);
        }
      } catch (err) {
        console.warn('Failed to load places for homepage discovery:', err.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadDirectoryPlaces();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter places matching the active category
  const matchingPlaces = allPlaces.filter((item) => {
    const cat = (item.category || '').toLowerCase();
    const q = (activeCategory.categoryQuery || '').toLowerCase();
    if (activeCategory.id === 'tourist') {
      return cat.includes('tourist') || cat.includes('historical');
    }
    return cat.includes(q);
  });

  return (
    <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Places Directory"
          title="Discover Hosur"
          subtitle="Explore cultural landmarks, scenic spots, public recreation areas, and local life across the Hosur region."
          action={
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 transition-colors"
            >
              <span>Explore Full Directory</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          }
        />

        {/* Category Navigation Pills / Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon || Compass;
            const isSelected = activeCategory.id === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs border border-emerald-800'
                    : 'bg-white text-stone-700 hover:bg-stone-100 hover:text-emerald-900 border border-stone-200'
                }`}
                aria-pressed={isSelected}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Category Overview & Content Grid */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200/60">
                <ActiveIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">{activeCategory.name}</h3>
                <p className="text-xs sm:text-sm text-stone-500">{activeCategory.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Coverage: Greater Hosur Taluk & Surrounds</span>
            </div>
          </div>

          {/* If verified places exist for this category, display real cards! */}
          {matchingPlaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {matchingPlaces.map((place) => (
                <div
                  key={place.id}
                  className="rounded-xl border border-stone-200 p-5 hover:border-emerald-700/60 hover:shadow-xs transition-all flex flex-col justify-between space-y-3 bg-stone-50/50"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {place.category}
                      </span>
                      <span className="text-[11px] font-medium text-stone-500">
                        {place.locality}
                      </span>
                    </div>

                    <h4 className="font-bold text-stone-900 text-sm leading-snug">
                      {place.name}
                    </h4>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {place.description}
                    </p>

                    <div className="pt-2 text-xs text-stone-500 space-y-1">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{place.address}</span>
                      </div>
                      {place.timings && (
                        <div className="flex items-center gap-1 text-[11px] text-stone-400">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{place.timings}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs">
                    {place.latitude && place.longitude ? (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                      >
                        Directions &rarr;
                      </a>
                    ) : (
                      <span className="text-stone-400">Hosur</span>
                    )}

                    <Link
                      to={`/explore?category=${encodeURIComponent(place.category)}`}
                      className="text-stone-500 hover:text-emerald-800 text-[11px]"
                    >
                      View in Explore
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Meaningful Empty State when genuinely no records exist (e.g. food, shopping) */
            <EmptyState
              icon={Compass}
              badgeText="Verification in Progress"
              title={`No verified listings published for ${activeCategory.name} yet`}
              description={`Directory records for ${activeCategory.name.toLowerCase()} are currently being gathered, reviewed against municipal records, and geocoded. HosurOne does not publish unverified listings or placeholder data. Verified locations will appear here as soon as verification completes.`}
              actionText={`Suggest a ${activeCategory.name.replace(/s$/, '')}`}
              onAction={() => onOpenSuggest && onOpenSuggest('place', activeCategory.name)}
              secondaryActionText="View Contributor Guidelines"
              onSecondaryAction={() => onOpenSuggest && onOpenSuggest('place', activeCategory.name)}
            />
          )}

          {/* Regional coverage reminder */}
          <div className="pt-2 text-center text-xs text-stone-400">
            <span>Verified localities include: Hosur City • Bagalur • Kelamangalam • Denkanikottai • Shoolagiri • Berigai • Anchetty</span>
          </div>
        </div>
      </div>
    </section>
  );
}
