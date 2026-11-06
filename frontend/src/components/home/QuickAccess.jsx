import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Bus,
  Landmark,
  HeartPulse,
  Building,
  CreditCard,
  PhoneCall,
  Newspaper,
  ChevronRight,
  Clock,
} from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

export default function QuickAccess() {
  const categories = [
    {
      id: 'government',
      name: 'Government Offices',
      description: 'Hosur City Municipal Corporation, Taluk Office, RTO, and Revenue offices.',
      icon: Landmark,
      path: '/government',
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'banks',
      name: 'Bank Branches',
      description: 'Verified public & private bank branches, IFSC codes, and addresses across Hosur.',
      icon: Building,
      path: '/banks',
      iconBg: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'hospitals',
      name: 'Hospitals & Health',
      description: 'Hosur Government Hospital, Primary Health Centres (PHCs), and medical aid.',
      icon: HeartPulse,
      path: '/government?category=Hospital',
      iconBg: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'transport',
      name: 'Transport & Transit',
      description: 'Hosur Central Bus Stand routes, railway junction connectivity, and transit hubs.',
      icon: Bus,
      path: '/transport',
      iconBg: 'bg-sky-100 text-sky-800',
    },
    {
      id: 'places',
      name: 'Explore Places',
      description: 'Parks, hill temples, heritage landmarks, and recreational lakes.',
      icon: Compass,
      path: '/explore',
      iconBg: 'bg-teal-100 text-teal-800',
    },
    {
      id: 'contacts',
      name: 'Important Contacts',
      description: 'Municipal control rooms, police stations, ambulance, and utility helplines.',
      icon: PhoneCall,
      path: '/government?category=Helpline',
      iconBg: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'community',
      name: 'Community Updates',
      description: 'Verified municipal announcements, civic news, and local public circulars.',
      icon: Newspaper,
      path: '/community',
      iconBg: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'atms',
      name: 'ATM Finder',
      description: '24/7 ATM locations and cash points. (Future module currently in research).',
      icon: CreditCard,
      path: '#atms-upcoming',
      isUpcoming: true,
      iconBg: 'bg-stone-100 text-stone-600',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Regional Services"
          title="Quick Access"
          subtitle="Direct links to essential civic directories, administrative departments, bank branches, and public services."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((item) => {
            const Icon = item.icon;

            if (item.isUpcoming) {
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-5 sm:p-6 flex flex-col justify-between opacity-80"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> Upcoming
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-stone-800 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200/60 text-xs text-stone-400 font-medium">
                    Scheduled in Future Release
                  </div>
                </div>
              );
            }

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
                  <span>Open Directory</span>
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
