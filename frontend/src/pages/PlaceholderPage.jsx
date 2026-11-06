import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Compass,
  Bus,
  Landmark,
  Newspaper,
  Briefcase,
  Info,
  Mail,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function PlaceholderPage({ onOpenSuggest }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const category = searchParams.get('category') || searchParams.get('cat') || searchParams.get('tab');

  const routeDetails = {
    '/explore': {
      title: 'Explore Hosur Directory',
      badge: 'Places Directory • Phase 1 Roadmap',
      icon: Compass,
      description:
        'A comprehensive geocoded directory of cultural landmarks, scenic spots, restaurants, parks, and religious sites across the Hosur region.',
      features: [
        'Verified geo-coordinates and OpenStreetMap integration',
        'Locality filtering (Hosur, Bagalur, Kelamangalam, Denkanikottai, Shoolagiri, Berigai, Anchetty)',
        'Operating hours, public transit access points, and official contacts',
        'Field-verified community photography',
      ],
    },
    '/transport': {
      title: 'Transport and Connectivity',
      badge: 'Regional Transit • Phase 1 Roadmap',
      icon: Bus,
      description:
        'Schedules, route information, and transit terminal connectivity for the Hosur regional transport hub.',
      features: [
        'Hosur Central Bus Stand platform & route guide',
        'Hosur Railway Station (SBC/SW Railway division) train connections',
        'Intercity bus routes to Bengaluru, Krishnagiri, Dharmapuri, Salem, and Chennai',
        'Local suburban town services connecting Bagalur, Kelamangalam & Denkanikottai',
      ],
    },
    '/services': {
      title: 'Government and Public Services',
      badge: 'Civic Administration • Phase 1 Roadmap',
      icon: Landmark,
      description:
        'Centralized official directory of municipal corporation offices, taluk centres, E-Sevai, police, and healthcare institutions.',
      features: [
        'Hosur City Municipal Corporation departments & ward offices',
        'Hosur Taluk Office, Revenue Inspector centres & RTO',
        'Government Hospital & Primary Health Centres (PHCs)',
        'Police stations, Fire & Rescue control rooms, and public utility helplines',
      ],
    },
    '/community': {
      title: 'Hosur Community Board',
      badge: 'Community & Civic Updates • Phase 1 Roadmap',
      icon: Newspaper,
      description:
        'A community-driven digital bulletin for verified local news, official public announcements, events, and lost-and-found notices.',
      features: [
        'Resident news submissions with editorial fact-checking',
        'Official municipal notices and public health advisories',
        'Regional festivals, sports meets, and cultural gatherings',
        'Public lost-and-found notice board',
      ],
    },
    '/opportunities': {
      title: 'Hosur Opportunities & Skills',
      badge: 'Local Economy • Phase 1 Roadmap',
      icon: Briefcase,
      description:
        'Directory for employment openings, apprenticeships, industrial training, and skill development across the Hosur industrial corridor.',
      features: [
        'Verified job postings from registered local employers',
        'Apprentice opportunities in SIPCOT industrial manufacturing sectors',
        'Government skill development programmes and polytechnic workshops',
        'Locality-based opportunity search',
      ],
    },
    '/about': {
      title: 'About the HosurOne Project',
      badge: 'Civic Mission & Vision',
      icon: Info,
      description:
        'HosurOne is an independent, non-commercial civic tech platform designed to unify public information across the Hosur region in Tamil Nadu.',
      features: [
        'Community-first, volunteer-driven editorial model',
        'Strict verification standards: no sponsored fake reviews or unverified claims',
        'Bilingual support: English primary, with Tamil localization in active development',
        'Open public feedback and community contribution channels',
      ],
    },
    '/contact': {
      title: 'Contact Civic Editorial Desk',
      badge: 'Public Desk & Support',
      icon: Mail,
      description:
        'Have verified public data to share, an official correction, or suggestions for the HosurOne platform? Connect with our civic coordination desk.',
      features: [
        'Editorial desk email: community@hosurone.in',
        'Public data corrections & updates review desk',
        'Volunteer field verifier enquiries',
        'Official municipal circular submittal desk',
      ],
    },
    '/privacy': {
      title: 'Privacy Policy (Draft / In Review)',
      badge: 'Legal & Data Governance • Draft',
      icon: Shield,
      description:
        'HosurOne values user privacy and data security. The official privacy framework is currently under review by legal advisors ahead of public member registrations.',
      features: [
        'Strictly zero third-party commercial ad tracking',
        'Minimal data collection: guest browsing requires zero personal information',
        'Contributor submission data used solely for factual verification and editorial attribution',
        'Compliance with applicable Indian Digital Personal Data Protection (DPDP) standards',
      ],
    },
  };

  const details = routeDetails[location.pathname] || {
    title: 'Hosur Regional Portal Section',
    badge: 'Under Active Development',
    icon: Compass,
    description: 'This module is scheduled for implementation in the upcoming release milestone.',
    features: ['Verified content compilation underway', 'Public submission review pipeline active'],
  };

  const Icon = details.icon;

  return (
    <main className="min-h-[80vh] bg-stone-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-10 shadow-2xs space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Clock className="w-3.5 h-3.5" />
              <span>{details.badge}</span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {details.title}
              </h1>
            </div>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              {details.description}
            </p>
          </div>

          {/* If routed with search query or category */}
          {(query || category) && (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs sm:text-sm space-y-1">
              <div className="font-semibold text-emerald-950">Active Filter Context:</div>
              {query && (
                <div className="text-emerald-900">
                  Search query requested: <strong>"{query}"</strong>
                </div>
              )}
              {category && (
                <div className="text-emerald-900">
                  Category filter requested: <strong>"{category}"</strong>
                </div>
              )}
              <div className="text-stone-500 text-xs pt-1">
                Full search indexing across verified regional databases will be activated as records are compiled.
              </div>
            </div>
          )}

          {/* Planned Features according to PRD */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700">
              Module Scope & Specifications (From Product Requirements)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {details.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs sm:text-sm text-stone-700 flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-2 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            {onOpenSuggest && (
              <button
                type="button"
                onClick={() => onOpenSuggest('place', details.title)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Submit Verified Information for this Section</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

