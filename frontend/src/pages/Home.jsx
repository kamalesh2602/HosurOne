import React from 'react';
import Hero from '../components/home/Hero';
import QuickAccess from '../components/home/QuickAccess';
import DiscoverSection from '../components/home/DiscoverSection';
import CommunitySection from '../components/home/CommunitySection';
import WeatherSection from '../components/home/WeatherSection';
import RegionalCoverage from '../components/home/RegionalCoverage';

export default function Home({ onOpenSuggest }) {
  return (
    <main className="min-h-screen">
      {/* 1. Hero Section */}
      <Hero onOpenSuggest={onOpenSuggest} />

      {/* 2. Quick Access Services */}
      <QuickAccess />

      {/* 3. Discover Hosur Directory Overview */}
      <DiscoverSection onOpenSuggest={onOpenSuggest} />

      {/* 4. Community Updates & Notices */}
      <CommunitySection onOpenSuggest={onOpenSuggest} />

      {/* 5. Hosur Live Weather Telemetry */}
      <WeatherSection />

      {/* 6. Regional Coverage (Hosur, Bagalur, Kelamangalam, Denkanikottai, Shoolagiri, Berigai, Anchetty) */}
      <RegionalCoverage onOpenSuggest={onOpenSuggest} />
    </main>
  );
}

