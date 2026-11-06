import React from 'react';
import { MapPin, Compass, ShieldCheck } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

export default function RegionalCoverage({ onOpenSuggest }) {
  const localities = [
    {
      name: 'Hosur City',
      role: 'Municipal Corporation & Industrial Engine',
      description: 'Major urban cluster, SIPCOT industrial zones, educational institutes, and transport connectivity.',
    },
    {
      name: 'Bagalur',
      role: 'Horticulture & Northern Gateway',
      description: 'Floriculture hubs, rose farming, vegetable transit corridors, and international boundary border access.',
    },
    {
      name: 'Kelamangalam',
      role: 'Taluk Hub & Agricultural Market',
      description: 'Weekly cattle markets, traditional sericulture, vegetable trade, and rural development offices.',
    },
    {
      name: 'Denkanikottai',
      role: 'Scenic Foothills & Eco-Gateway',
      description: 'Historic Betrayaswamy shrine, forested hill terrain, and entry point to Anchetty forest ranges.',
    },
    {
      name: 'Shoolagiri',
      role: 'NH44 Corridor & Granite Belt',
      description: 'Prominent landmark rock hills, Chennai-Bengaluru highway logistics, and emerging manufacturing clusters.',
    },
    {
      name: 'Berigai',
      role: 'Eastern Border Panchayat',
      description: 'Border trade, peaceful rural agrarian communities, and cross-border transit links.',
    },
    {
      name: 'Anchetty',
      role: 'Cauvery River Basin & Forest Zone',
      description: 'Picturesque valley, wildlife reserve buffer, traditional millet farming, and eco-tourism routes.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Regional Scope"
          title="Beyond Hosur City: Regional Coverage"
          subtitle="HosurOne is committed to serving the complete geographic and cultural landscape of the greater Hosur region."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {localities.map((loc) => (
            <div
              key={loc.name}
              className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-5 hover:border-emerald-600/40 hover:bg-white hover:shadow-2xs transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-base">{loc.name}</h3>
                </div>

                <div className="text-xs font-semibold text-emerald-800/90 mb-2">
                  {loc.role}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {loc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                <span>Coverage Verified</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600" />
              </div>
            </div>
          ))}

          {/* Contribution invitation card */}
          <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 p-5 flex flex-col justify-between text-center sm:text-left">
            <div>
              <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-900 text-base">Your Locality</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Know of a panchayat, historic temple, government office, or healthcare centre in this region that should be listed?
              </p>
            </div>

            <div className="mt-4 pt-3">
              <button
                type="button"
                onClick={() => onOpenSuggest && onOpenSuggest('place', 'Local Locality')}
                className="w-full py-2 px-3 rounded-xl bg-emerald-800 text-white text-xs font-medium hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer"
              >
                Submit Locality Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

