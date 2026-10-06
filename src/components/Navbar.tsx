import React from 'react';
import {
  Sparkles,
  Calendar,
  ClipboardList,
  UserCheck,
  LogOut,
  CalendarCheck2,
  Globe,
  Phone,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentTab: 'book' | 'catalog' | 'agenda' | 'about';
  setCurrentTab: (tab: 'book' | 'catalog' | 'agenda' | 'about') => void;
  lang: 'es' | 'en';
  setLang: (lang: 'es' | 'en') => void;
  user: User | null;
  hasToken: boolean;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  user,
  hasToken,
  onLogin,
  onLogout,
  isLoggingIn,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e2d7c5] shadow-xs">
      {/* Top Banner with Quote & WhatsApp */}
      <div className="bg-[#415344] text-[#f2ede4] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#c5a059]">✦</span>
            <span className="font-serif italic tracking-wide text-xs sm:text-sm">
              {lang === 'es'
                ? '"Tu cuerpo recuerda lo que tu mente olvidó."'
                : '"Your body remembers what your mind has forgotten."'}
            </span>
            <span className="hidden md:inline text-[#c5a059]/60">·</span>
            <span className="hidden md:inline text-[11px] opacity-80 uppercase tracking-widest">
              Ancestral Wellness Experience · Ecuador
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://wa.me/593990587684?text=Hola%20Lissett,%20deseo%20informaci%C3%B3n%20sobre%20las%20sesiones%20en%20AWE%20SPA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#c5a059] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="font-medium">+593 99 058 7684</span>
            </a>
            <div className="h-3 w-px bg-white/20" />
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/20 hover:border-[#c5a059] text-[11px] font-medium transition-colors"
            >
              <Globe className="w-3 h-3 text-[#c5a059]" />
              <span>{lang.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Therapist Branding */}
          <div
            onClick={() => setCurrentTab('book')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-full bg-[#415344] text-[#c5a059] flex items-center justify-center border-2 border-[#c5a059]/40 shadow-inner group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold tracking-[0.25em] text-[#8e5d43] uppercase">
                  AWE SPA
                </span>
                <span className="text-[10px] text-[#c5a059]">✦</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2d2a26] tracking-tight leading-none group-hover:text-[#415344] transition-colors">
                Lissett Morante
              </h1>
              <p className="text-[11px] text-[#6b645b] font-medium tracking-wider">
                Spa & Holistic Wellness
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('book')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'book'
                  ? 'bg-[#415344] text-white shadow-xs'
                  : 'text-[#4a453e] hover:bg-[#ede5d8]'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#c5a059]" />
              <span>{lang === 'es' ? 'Reservar Cita' : 'Book Session'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('catalog')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'catalog'
                  ? 'bg-[#415344] text-white shadow-xs'
                  : 'text-[#4a453e] hover:bg-[#ede5d8]'
              }`}
            >
              <ClipboardList className="w-4 h-4 text-[#c5a059]" />
              <span>{lang === 'es' ? 'Carta de Servicios' : 'Spa Menu'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('agenda')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 relative ${
                currentTab === 'agenda'
                  ? 'bg-[#415344] text-white shadow-xs'
                  : 'text-[#4a453e] hover:bg-[#ede5d8]'
              }`}
            >
              <CalendarCheck2 className="w-4 h-4 text-[#c5a059]" />
              <span>{lang === 'es' ? 'Agenda & Calendario' : 'Therapist Agenda'}</span>
              {hasToken && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('about')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'about'
                  ? 'bg-[#415344] text-white shadow-xs'
                  : 'text-[#4a453e] hover:bg-[#ede5d8]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#c5a059]" />
              <span>{lang === 'es' ? 'Lissett Morante' : 'About'}</span>
            </button>
          </nav>

          {/* Google Auth Status / Button (following Workspace Skill design) */}
          <div className="flex items-center gap-2">
            {user && hasToken ? (
              <div className="flex items-center gap-2 bg-[#f0eae1] border border-[#d8ccbc] py-1 px-2.5 rounded-full shadow-xs">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google Account'}
                    className="w-7 h-7 rounded-full border border-[#c5a059]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#415344] text-white text-xs flex items-center justify-center font-bold">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-[#2d2a26] leading-none truncate max-w-[120px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                    Calendar Sync
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign out of Google"
                  className="p-1 text-[#6b645b] hover:text-red-700 hover:bg-white rounded-full transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Official Google Sign-In button specification */
              <button
                onClick={onLogin}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-2.5 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold py-2 px-3.5 rounded-lg border border-neutral-300 shadow-xs hover:shadow-sm active:scale-98 transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>{isLoggingIn ? 'Conectando...' : 'Google Sync'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 border-t border-[#ede5d8] no-scrollbar">
          <button
            onClick={() => setCurrentTab('book')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              currentTab === 'book'
                ? 'bg-[#415344] text-white'
                : 'bg-[#f0eae1] text-[#4a453e]'
            }`}
          >
            {lang === 'es' ? 'Reservar' : 'Book'}
          </button>
          <button
            onClick={() => setCurrentTab('catalog')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              currentTab === 'catalog'
                ? 'bg-[#415344] text-white'
                : 'bg-[#f0eae1] text-[#4a453e]'
            }`}
          >
            {lang === 'es' ? 'Carta de Servicios' : 'Spa Menu'}
          </button>
          <button
            onClick={() => setCurrentTab('agenda')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 ${
              currentTab === 'agenda'
                ? 'bg-[#415344] text-white'
                : 'bg-[#f0eae1] text-[#4a453e]'
            }`}
          >
            <span>{lang === 'es' ? 'Agenda' : 'Agenda'}</span>
            {hasToken && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </button>
          <button
            onClick={() => setCurrentTab('about')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              currentTab === 'about'
                ? 'bg-[#415344] text-white'
                : 'bg-[#f0eae1] text-[#4a453e]'
            }`}
          >
            Lissett
          </button>
        </div>
      </div>
    </header>
  );
};
