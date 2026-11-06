import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, ShieldAlert, ExternalLink, Sparkles } from 'lucide-react';

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Footer({ onOpenSuggest }) {
  const currentYear = new Date().getFullYear();

  const localities = [
    'Hosur Corporation',
    'Bagalur',
    'Kelamangalam',
    'Denkanikottai',
    'Shoolagiri',
    'Berigai',
    'Anchetty',
  ];

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-sm">
      {/* Top Banner: Civic Mission */}
      <div className="border-b border-stone-800/80 bg-stone-950/60 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-stone-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              <strong>HosurOne</strong> is a non-commercial, community-driven digital information portal for the complete Hosur region of Tamil Nadu.
            </span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Primary: English</span>
            <span>•</span>
            <span>Secondary: தமிழ்</span>
            <span>•</span>
            <a
              href="https://github.com/kamalesh2602/HosurOne"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl border border-emerald-600/50">
                <span>H</span>
                <span className="text-emerald-300 text-xs font-bold">1</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Hosur<span className="text-emerald-400">One</span>
              </span>
            </div>

            <p className="text-emerald-300 text-sm font-semibold tracking-wide">
              Your Region. Your Community. One Portal.
            </p>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-md">
              A centralized civic tech platform connecting residents, visitors, students, and businesses with authentic local information across the greater Hosur industrial and agricultural belt.
            </p>

            <div className="pt-2 text-xs text-stone-400 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Hosur Region, Krishnagiri District, Tamil Nadu – 635109, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>community@hosurone.in (Civic Editorial Desk)</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Verified Directories
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-stone-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-stone-400 hover:text-white transition-colors">
                  Local Directory
                </Link>
              </li>
              <li>
                <Link to="/banks" className="text-stone-400 hover:text-white transition-colors">
                  Bank Branch Finder
                </Link>
              </li>
              <li>
                <Link to="/weather" className="text-stone-400 hover:text-white transition-colors">
                  Hosur Live Weather
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-stone-400 hover:text-white transition-colors">
                  Explore Places
                </Link>
              </li>
              <li>
                <Link to="/transport" className="text-stone-400 hover:text-white transition-colors">
                  Transport & Transit
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Localities */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Regional Coverage
            </h3>
            <p className="text-xs text-stone-400">Covering key taluks and urban areas:</p>
            <ul className="space-y-1.5 text-xs">
              {localities.map((loc) => (
                <li key={loc} className="flex items-center gap-1.5 text-stone-300">
                  <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                  <span>{loc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contribution & About */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Community & Governance
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              HosurOne is open-source and maintained with contributions from local volunteers and public records.
            </p>

            <div className="space-y-2 pt-1">
              {onOpenSuggest && (
                <button
                  type="button"
                  onClick={() => onOpenSuggest('place')}
                  className="w-full text-left px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-emerald-300 font-medium transition-colors border border-stone-700 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Submit Information
                  </span>
                  <span>→</span>
                </button>
              )}

              <a
                href="https://github.com/kamalesh2602/HosurOne"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs text-stone-400 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5" /> GitHub Repository
                </span>
                <ExternalLink className="w-3 h-3 text-stone-500" />
              </a>

              <Link
                to="/about"
                className="block text-xs text-stone-400 hover:text-white transition-colors"
              >
                About HosurOne Project
              </Link>
              <Link
                to="/contact"
                className="block text-xs text-stone-400 hover:text-white transition-colors"
              >
                Contact Civic Desk
              </Link>
              <Link
                to="/privacy"
                className="inline-flex items-center gap-1 text-xs text-amber-300/80 hover:text-amber-300 transition-colors"
              >
                <span>Privacy Policy (Draft / In Review)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Legal & Independent Disclaimer */}
        <div className="mt-12 pt-8 border-t border-stone-800 text-xs text-stone-500 space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-stone-400">
              <ShieldAlert className="w-4 h-4 text-stone-500 shrink-0" />
              <span>
                <strong>Independent Civic Notice:</strong> HosurOne is an independent community portal and is not an official branch of the Hosur Municipal Corporation or the Government of Tamil Nadu.
              </span>
            </div>
            <div className="text-stone-400 shrink-0">
              © {currentYear} HosurOne. Open Civic Commons.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
