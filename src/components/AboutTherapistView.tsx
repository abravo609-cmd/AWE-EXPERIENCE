import React from 'react';
import {
  Sparkles,
  Award,
  Heart,
  ShieldCheck,
  Phone,
  Instagram,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Lang } from '../types/spa';
import { BRAND, CREDENTIALS, whatsappUrl } from '../data/brand';

/** Un icono por credencial, en el mismo orden que CREDENTIALS. */
const CREDENTIAL_ICONS = [Award, ShieldCheck, Sparkles, Heart];

interface AboutTherapistViewProps {
  lang: Lang;
  onBookNow: () => void;
}

export const AboutTherapistView: React.FC<AboutTherapistViewProps> = ({ lang, onBookNow }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Hero Profile */}
      <div className="bg-gradient-to-br from-[#38483b] via-[#415344] to-[#4e6252] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg border border-[#5a735e]">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 text-[#ebd8b1] text-xs font-semibold tracking-wider uppercase border border-[#c5a059]/30">
            <span>✦ Terapeuta & Fundadora</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">
            {BRAND.therapist}
          </h2>

          <p className="text-xs sm:text-sm text-[#d8dfd7] leading-relaxed font-light">
            {lang === 'es'
              ? 'Con 14 años de experiencia en bienestar de lujo internacional, fusiono la precisión de las terapias más sofisticadas del mundo con la sabiduría de las tradiciones ancestrales de Ecuador. Cada sesión es un templo donde no solo se relajan los músculos, sino que se libera lo que el alma ha cargado en silencio.'
              : 'With 14 years of international luxury spa leadership, I fuse the precision of elite bodywork therapies with the ancestral wisdom of Ecuador. Every session offers a temple of peace where muscles ease and the soul releases what it has silently carried.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onBookNow}
              className="px-6 py-3 rounded-xl bg-[#c5a059] hover:bg-[#b5924d] text-[#1e1c1a] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'es' ? 'Reservar Cita con Lisett' : 'Book a Session'}</span>
            </button>

            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#ebd8b1]" />
              <span>WhatsApp: {BRAND.whatsapp.display}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CREDENTIALS.map((c, i) => {
          const Icon = CREDENTIAL_ICONS[i];
          return (
            <div
              key={i}
              className="p-5 bg-white rounded-2xl border border-[#e2d7c5] shadow-xs space-y-2 hover:border-[#c5a059] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#faf7f2] border border-[#ede5d8] text-[#415344] flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#8e5d43]" />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#2d2a26]">{c.title}</h4>
              <p className="text-xs text-[#6e665d] leading-relaxed">{c.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Philosophy Callout */}
      <div className="bg-[#faf7f2] p-6 sm:p-8 rounded-3xl border border-[#ede5d8] space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#2d2a26] text-center">
          ✦ La Filosofía de AWE SPA ✦
        </h3>
        <p className="text-xs sm:text-sm text-[#4a453e] leading-relaxed text-center max-w-2xl mx-auto font-light">
          "{BRAND.motto} Cada persona que llega a nuestra camilla carga una historia en su cuello,
          en su espalda, en sus pies. No realizamos masajes genéricos: evaluamos restricciones,
          cirugías previas, posibles contraindicaciones y la intención de tu alma para devolverte a
          tu centro."
        </p>

        <div className="pt-4 border-t border-[#e2d7c5] flex flex-wrap items-center justify-center gap-6 text-xs text-[#524c44]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#415344]" />
            Atención exclusiva e individualizada
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#415344]" />
            Aceites botánicos puros & hierbas ecuatorianas
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#415344]" />
            Sincronización en tiempo real y abono seguro
          </span>
        </div>
      </div>

      {/* Location and Contact */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2d7c5] shadow-xs text-center space-y-3">
        <h4 className="text-base font-serif font-bold text-[#2d2a26]">
          Contacto Directo & Ubicación
        </h4>
        <p className="text-xs text-[#736c63]">
          Ecuador · Agenda previa coordinada con 50% de abono
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-[#415344] pt-2">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#faf7f2] border border-[#ede5d8] hover:bg-[#ede5d8] transition-colors"
          >
            <Phone className="w-4 h-4 text-[#8e5d43]" />
            <span>{BRAND.whatsapp.display}</span>
          </a>
          <a
            href={BRAND.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#faf7f2] border border-[#ede5d8] hover:bg-[#ede5d8] transition-colors"
          >
            <Instagram className="w-4 h-4 text-[#8e5d43]" />
            <span>{BRAND.instagram.handle}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
