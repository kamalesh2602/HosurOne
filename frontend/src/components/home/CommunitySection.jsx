import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  BellRing,
  CalendarDays,
  SearchAlert,
  ShieldCheck,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';

export default function CommunitySection({ onOpenSuggest }) {
  const communityCategories = [
    {
      id: 'news',
      name: 'Local News',
      icon: Newspaper,
      description: 'Verified civic developments, municipal initiatives, and infrastructure milestones across Hosur.',
      emptyReason:
        'No news articles have been published yet. HosurOne accepts verified news updates from registered residents and local contributors. All submissions are moderated before publishing to ensure accuracy.',
    },
    {
      id: 'announcements',
      name: 'Announcements',
      icon: BellRing,
      description: 'Official municipal circulars, public utility maintenance notices, and regional health advisories.',
      emptyReason:
        'No public announcements currently active. Official notices regarding water maintenance, electrical shutdowns, traffic advisories, or civic alerts will be posted here as they are issued.',
    },
    {
      id: 'events',
      name: 'Events',
      icon: CalendarDays,
      description: 'Community gatherings, cultural festivals, exhibitions, sports tournaments, and village fairs.',
      emptyReason:
        'No upcoming events listed at present. Local organizations and residents can submit community and cultural event schedules for verification and listing.',
    },
    {
      id: 'lost-found',
      name: 'Lost and Found',
      icon: SearchAlert,
      description: 'Public community bulletin for lost documents, keys, pets, or recovered personal items.',
      emptyReason:
        'No active lost and found reports. Residents can submit notices with verifiable contact details to help recover lost belongings within the Hosur region.',
    },
  ];

  const [activeTab, setActiveTab] = useState(communityCategories[0]);
  const ActiveIcon = activeTab?.icon || Newspaper;

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Community Hub"
          title="Community Updates"
          subtitle="Stay informed with verified local developments, public notices, upcoming gatherings, and community bulletins."
          action={
            <Link
              to="/community"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 transition-colors"
            >
              <span>Visit Community Board</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          }
        />

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {communityCategories.map((cat) => {
            const Icon = cat.icon || Newspaper;
            const isSelected = activeTab.id === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs border border-emerald-800'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100 hover:text-emerald-900 border border-stone-200'
                }`}
                aria-pressed={isSelected}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 flex items-center justify-center border border-stone-200 shadow-2xs">
                <ActiveIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">{activeTab.name}</h3>
                <p className="text-xs sm:text-sm text-stone-600">{activeTab.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Moderated by Community Editorial Desk</span>
            </div>
          </div>

          {/* Meaningful Empty State - Strictly zero mock articles or fake dates */}
          <EmptyState
            icon={ActiveIcon}
            badgeText="No Active Posts"
            title={`No ${activeTab.name.toLowerCase()} published at this time`}
            description={activeTab.emptyReason}
            actionText={`Submit an entry for ${activeTab.name}`}
            onAction={() => onOpenSuggest && onOpenSuggest('community', activeTab.name)}
            secondaryActionText="How Publishing Works"
            onSecondaryAction={() => onOpenSuggest && onOpenSuggest('community', activeTab.name)}
          />

          {/* Moderation Transparency Note */}
          <div className="p-4 rounded-xl bg-white border border-stone-200/80 text-xs text-stone-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Community Trust Standard:</strong> HosurOne operates a tiered contributor model. Submissions require administrator verification to keep content free from misinformation.
              </span>
            </div>
            <Link
              to="/community"
              className="text-emerald-800 hover:text-emerald-900 font-semibold underline shrink-0"
            >
              Learn about contributor status
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
