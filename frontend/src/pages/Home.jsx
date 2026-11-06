import React from 'react';
import Hero from '../components/home/Hero';
import WeatherWidget from '../components/home/WeatherWidget';
import QuickAccess from '../components/home/QuickAccess';
import DiscoverSection from '../components/home/DiscoverSection';
import CommunitySection from '../components/home/CommunitySection';
import RegionalCoverage from '../components/home/RegionalCoverage';

export default function Home({ onOpenSuggest }) {
  return (
    <main className="min-h-screen">
      {/* 1. Hero Introduction */}
      <Hero onOpenSuggest={onOpenSuggest} />

      {/* 2. TOP PRIORITY: Compact Weather Summary Widget directly beneath Hero */}
      <WeatherWidget />

      {/* 3. Quick Access Services Grid */}
      <QuickAccess />

      {/* 4. Discover Hosur Places Directory Overview */}
      <DiscoverSection onOpenSuggest={onOpenSuggest} />

      {/* 5. Community Updates, Circulars & Announcements */}
      <CommunitySection onOpenSuggest={onOpenSuggest} />

      {/* 6. Regional Coverage Scope */}
      <RegionalCoverage onOpenSuggest={onOpenSuggest} />
    </main>
  );
}
