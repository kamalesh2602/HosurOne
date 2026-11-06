import React, { useState } from 'react';
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
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';

export default function DiscoverSection({ onOpenSuggest }) {
  const categories = [
    {
      id: 'tourist',
      name: 'Tourist attractions',
      icon: Camera,
      description: 'Historical forts, scenic viewpoints, viewpoints, and cultural heritage across Hosur and nearby taluks.',
      coverageScope: 'Chandrachoodeswarar Hill Temple, Rajaji Memorial, Thally Little England, Panchapalli Dam',
    },
    {
      id: 'food',
      name: 'Food and restaurants',
      icon: Utensils,
      description: 'Traditional Tamil Nadu messes, regional breakfast spots, highway diners, and local eateries.',
      coverageScope: 'Hosur City, Bagalur Road, Rayakottah Road, and NH44 Highway corridor',
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: ShoppingBag,
      description: 'Local bazaars, weekly farmers markets (Santha), handlooms, silk centres, and shopping complexes.',
      coverageScope: 'MG Road, Gandhi Statue Market, weekly Sunday markets, and cooperative handloom outlets',
    },
    {
      id: 'parks',
      name: 'Parks and recreation',
      icon: Trees,
      description: 'Public parks, municipal gardens, recreational lakes, walking trails, and eco-tourism spots.',
      coverageScope: 'Ramanaicken Lake promenade, Eco Park, and municipal children’s parks',
    },
    {
      id: 'religious',
      name: 'Religious places',
      icon: Landmark,
      description: 'Ancient temples, historic churches, and mosques representing the diverse heritage of the region.',
      coverageScope: 'Hill temples, heritage shrines, and ancient Chola/Hoysala period landmarks',
    },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const ActiveIcon = activeCategory?.icon || Compass;

  return (
    <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Places Directory"
          title="Discover Hosur"
          subtitle="Explore the cultural landmarks, scenic spots, public recreation areas, and local life across the Hosur region."
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

        {/* Active Category Overview & Meaningful Empty State */}
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

          {/* Meaningful Empty State - Honoring rule: No fake place cards or mock data */}
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

          {/* Regional coverage reminder */}
          <div className="pt-2 text-center text-xs text-stone-400">
            <span>Verified localities include: Hosur City • Bagalur • Kelamangalam • Denkanikottai • Shoolagiri • Berigai • Anchetty</span>
          </div>
        </div>
      </div>
    </section>
  );
}
