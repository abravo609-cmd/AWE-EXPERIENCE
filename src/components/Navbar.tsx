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
  LucideIcon,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Lang, Tab } from '../types/spa';
import { BRAND, quote, whatsappUrl } from '../data/brand';

const TABS: {
  id: Tab;
  icon: LucideIcon;
  label: Record<Lang, string>;
  mobileLabel: Record<Lang, string>;
}[] = [
  {
    id: 'book',
    icon: Calendar,
    label: { es: 'Reservar Cita', en: 'Book Session' },
    mobileLabel: { es: 'Reservar', en: 'Book' },
  },
  {
    id: 'catalog',
    icon: ClipboardList,
    label: { es: 'Carta de Servicios', en: 'Spa Menu' },
    mobileLabel: { es: 'Carta de Servicios', en: 'Spa Menu' },
  },
  {
    id: 'agenda',
    icon: CalendarCheck2,
    label: { es: 'Agenda & Calendario', en: 'Therapist Agenda' },
    mobileLabel: { es: 'Agenda', en: 'Agenda' },
  },
  {
    id: 'about',
    icon: UserCheck,
    label: { es: 'Lisett Morante', en: 'About' },
    mobileLabel: { es: 'Lisett', en: 'Lisett' },
  },
];

interface NavbarProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
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
  // La agenda con fichas de salud solo aparece con la sesión de Google iniciada
  const visibleTabs = TABS.filter((tab) => tab.id !== 'agenda' || hasToken);

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e2d7c5] shadow-xs">
      {/* Top Banner with Quote & WhatsApp */}
      <div className="bg-[#415344] text-[#f2ede4] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#c5a059]">✦</span>
            <span className="font-serif italic tracking-wide text-xs sm:text-sm">
              {quote(lang)}
            </span>
            <span className="hidden md:inline text-[#c5a059]/60">·</span>
            <span className="hidden md:inline text-[11px] opacity-80 uppercase tracking-widest">
              {BRAND.fullName} · Ecuador
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={whatsappUrl(
                `Hola Lisett, deseo información sobre las sesiones en ${BRAND.name}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#c5a059] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="font-medium">{BRAND.whatsapp.display}</span>
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
                  {BRAND.name}
                </span>
                <span className="text-[10px] text-[#c5a059]">✦</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2d2a26] tracking-tight leading-none group-hover:text-[#415344] transition-colors">
                {BRAND.therapist}
              </h1>
              <p className="text-[11px] text-[#6b645b] font-medium tracking-wider">
                {BRAND.subtitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {visibleTabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setCurrentTab(id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  id === 'agenda' ? 'relative' : ''
                } ${
                  currentTab === id
                    ? 'bg-[#415344] text-white shadow-xs'
                    : 'text-[#4a453e] hover:bg-[#ede5d8]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#c5a059]" />
                <span>{label[lang]}</span>
                {id === 'agenda' && hasToken && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            ))}
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
          {visibleTabs.map(({ id, mobileLabel }) => (
            <button
              key={id}
              onClick={() => setCurrentTab(id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                id === 'agenda' ? 'flex items-center gap-1' : ''
              } ${currentTab === id ? 'bg-[#415344] text-white' : 'bg-[#f0eae1] text-[#4a453e]'}`}
            >
              <span>{mobileLabel[lang]}</span>
              {id === 'agenda' && hasToken && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
