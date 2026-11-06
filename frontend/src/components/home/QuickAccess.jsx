import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Bus,
  Landmark,
  HeartPulse,
  PhoneCall,
  Newspaper,
  CalendarDays,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

export default function QuickAccess() {
  const categories = [
    {
      id: 'explore',
      name: 'Explore Places',
      description: 'Parks, tourist destinations, heritage spots, and regional points of interest.',
      icon: Compass,
      path: '/explore',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'transport',
      name: 'Transport',
      description: 'Central bus stand routes, railway junction connectivity, and local transit information.',
      icon: Bus,
      path: '/transport',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      iconBg: 'bg-sky-100 text-sky-800',
    },
    {
      id: 'government',
      name: 'Government Offices',
      description: 'Hosur City Municipal Corporation, Taluk Office, RTO, and revenue department centres.',
      icon: Landmark,
      path: '/services?category=government',
      badgeColor: 'bg-stone-100 text-stone-800 border-stone-200',
      iconBg: 'bg-stone-200 text-stone-800',
    },
    {
      id: 'hospitals',
      name: 'Hospitals',
      description: 'Government Hospital, Primary Health Centres (PHCs), and medical facilities.',
      icon: HeartPulse,
      path: '/services?category=hospitals',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'contacts',
      name: 'Important Contacts',
      description: 'Direct directory for police stations, municipal control rooms, fire services, and helplines.',
      icon: PhoneCall,
      path: '/services?category=contacts',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'news',
      name: 'Community News',
      description: 'Verified civic developments, public infrastructure updates, and official municipal notices.',
      icon: Newspaper,
      path: '/community?tab=news',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'events',
      name: 'Events',
      description: 'Regional cultural festivals, community forums, sports meets, and local exhibitions.',
      icon: CalendarDays,
      path: '/community?tab=events',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      iconBg: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'jobs',
      name: 'Local Jobs',
      description: 'Employment opportunities, apprentice training, and skill programs across industrial corridors.',
      icon: Briefcase,
      path: '/opportunities?tab=jobs',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      iconBg: 'bg-teal-100 text-teal-800',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Essential Services"
          title="Quick Access"
          subtitle="Direct links to essential public directories, civic administration, and regional services across Hosur."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className="group relative rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 hover:border-emerald-700/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors group-hover:bg-emerald-800 group-hover:text-white ${item.iconBg}`}
                    >
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-105" />
                    </div>

                    <span className="text-stone-400 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-stone-900 group-hover:text-emerald-900 transition-colors mb-2">
                    {item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-emerald-800 group-hover:text-emerald-900">
                  <span>Browse Directory</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

