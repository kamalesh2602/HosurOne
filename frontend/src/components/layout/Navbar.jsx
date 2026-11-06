import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Globe, Sparkles, Shield, User, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar({ onOpenSuggest }) {
  const { user, isLoggedIn, isAdmin, logout, quickLoginAs } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'ta'
  const [langNotice, setLangNotice] = useState(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Local Directory', path: '/directory' },
    { name: 'Weather', path: '/weather' },
    { name: 'Contribute', path: '/contribute' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin Moderation', path: '/admin' });
  }

  const handleLanguageToggle = (lang) => {
    setLanguage(lang);
    if (lang === 'ta') {
      setLangNotice('தமிழ் மொழிபெயர்ப்பு செயல்பாட்டில் உள்ளது. (Tamil localization in progress)');
    } else {
      setLangNotice('English selected (Primary language).');
    }
    setTimeout(() => {
      setLangNotice(null);
    }, 4000);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
      {/* Civic context banner */}
      <div className="bg-emerald-950 text-white text-[11px] sm:text-xs py-1 px-4 text-center font-medium tracking-wide">
        <span className="inline-flex items-center gap-1.5 opacity-90">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Hosur Regional Portal • Covering Hosur City, Bagalur, Kelamangalam, Denkanikottai & Shoolagiri
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg p-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-xs group-hover:bg-emerald-900 transition-colors border border-emerald-700/50">
              <span className="tracking-tighter">H</span>
              <span className="text-emerald-300 text-sm font-semibold -ml-0.5">1</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-900 group-hover:text-emerald-900 transition-colors">
                  Hosur<span className="text-emerald-800">One</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                  Civic Portal
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium tracking-tight -mt-0.5 hidden xs:block">
                Your Region. Your Community. One Portal.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-2xs border border-emerald-200/80'
                      : 'text-stone-600 hover:text-emerald-800 hover:bg-stone-100/70'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleLanguageToggle('en')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                aria-pressed={language === 'en'}
                title="Switch to English"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageToggle('ta')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'ta'
                    ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                aria-pressed={language === 'ta'}
                title="Switch to Tamil (தமிழ்)"
              >
                தமிழ்
              </button>
            </div>

            {/* Auth / Account status */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-stone-800 max-w-[100px] truncate">{user.name}</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  {user.role === 'verified_contributor' ? 'Verified' : user.role}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign out"
                  className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/contribute"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => handleLanguageToggle(language === 'en' ? 'ta' : 'en')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 bg-stone-50 cursor-pointer sm:hidden"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:text-emerald-800 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Language Switcher Notice Toast */}
      {langNotice && (
        <div className="bg-amber-50 border-y border-amber-200 px-4 py-2 text-center text-xs text-amber-900 flex items-center justify-center gap-2 animate-in fade-in duration-150">
          <Globe className="w-4 h-4 shrink-0 text-amber-700" />
          <span>{langNotice}</span>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              HosurOne Navigation
            </span>
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => handleLanguageToggle('en')}
                className={`px-2 py-0.5 rounded ${
                  language === 'en' ? 'bg-white text-emerald-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageToggle('ta')}
                className={`px-2 py-0.5 rounded ${
                  language === 'ta' ? 'bg-white text-emerald-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1 pt-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-emerald-800'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {isLoggedIn ? (
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between px-2 text-xs">
              <span className="font-semibold text-stone-800">{user.name} ({user.role})</span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="text-rose-600 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-stone-100">
              <Link
                to="/contribute"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-stone-100 text-stone-800 font-medium text-xs hover:bg-stone-200 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
