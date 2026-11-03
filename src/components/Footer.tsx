import React from 'react';
import { BRAND, whatsappUrl } from '../data/brand';

export const Footer: React.FC = () => (
  <footer className="bg-[#2d2a26] text-[#e0ded8] py-12 border-t border-[#443f38]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#443f38]">
        <div className="text-center md:text-left">
          <span className="text-xs font-semibold text-[#c5a059] tracking-[0.25em] uppercase">
            ✦ {BRAND.fullName.toUpperCase()} ✦
          </span>
          <h3 className="text-2xl font-serif font-bold text-white mt-1">
            {BRAND.therapist.toUpperCase()}
          </h3>
          <p className="text-xs text-[#a89e90]">{BRAND.subtitle} · Ecuador 2026</p>
        </div>

        <div className="text-center md:text-right text-xs space-y-1">
          <p className="font-serif italic text-sm text-[#ebd8b1]">"{BRAND.tagline.es}"</p>
          <p className="text-[#a89e90]">
            WhatsApp:{' '}
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#c5a059] font-medium"
            >
              {BRAND.whatsapp.display}
            </a>
          </p>
          <p className="text-[#a89e90]">Instagram: {BRAND.instagram.handle}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8e8477]">
        <p>
          © {new Date().getFullYear()} {BRAND.name} · {BRAND.therapist}. Todos los derechos
          reservados.
        </p>
        <div className="flex items-center gap-4">
          <span>Abono de confirmación 50%</span>
          <span>·</span>
          <span>Cancelación gratuita 24h antes</span>
          <span>·</span>
          <span>Google Calendar Sync</span>
        </div>
      </div>
    </div>
  </footer>
);
