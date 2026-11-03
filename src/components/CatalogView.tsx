import React from 'react';
import { TREATMENTS } from '../data/treatments';
import { Lang, Treatment, TreatmentDuration } from '../types/spa';
import { ArrowRight } from 'lucide-react';
import { BRAND, CREDENTIALS, quote, whatsappUrl } from '../data/brand';

interface CatalogViewProps {
  lang: Lang;
  onSelectForBooking: (treatment: Treatment, duration: TreatmentDuration) => void;
}

type SelectHandler = CatalogViewProps['onSelectForBooking'];

const cardBase =
  'bg-white rounded-3xl border border-[#e2d7c5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow';

const SectionHeader: React.FC<{ eyebrow: string; title: string; subtitle: string }> = ({
  eyebrow,
  title,
  subtitle,
}) => (
  <div className="text-center space-y-1">
    <span className="text-xs font-bold text-[#c5a059] tracking-widest uppercase">{eyebrow}</span>
    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2a26]">{title}</h2>
    <p className="text-xs sm:text-sm text-[#736c63] italic">{subtitle}</p>
  </div>
);

const BookButton: React.FC<{ lang: Lang; onClick: () => void; className: string }> = ({
  lang,
  onClick,
  className,
}) => (
  <button
    onClick={onClick}
    className={`rounded-xl bg-[#415344] hover:bg-[#344337] text-white text-xs font-semibold flex items-center transition-colors ${className}`}
  >
    <span>{lang === 'es' ? 'Reservar' : 'Book'}</span>
    <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
  </button>
);

const Benefit: React.FC<{ t: Treatment; lang: Lang; indent: string }> = ({ t, lang, indent }) => (
  <div
    className={`text-xs text-[#6e665d] italic border-l-2 border-[#c5a059] ${indent} py-0.5 mb-4`}
  >
    <span className="font-semibold not-italic text-[#415344]">
      {lang === 'es' ? 'Beneficio: ' : 'Benefit: '}
    </span>
    {lang === 'es' ? t.benefits : t.benefitsEn}
  </div>
);

const Subtitle: React.FC<{ t: Treatment; lang: Lang }> = ({ t, lang }) => (
  <p className="text-xs font-semibold text-[#8e5d43] mt-0.5 mb-2">
    {lang === 'es' ? t.subtitle : t.subtitleEn}
  </p>
);

/** Ritual: tarjeta grande con lista de lo que incluye y ahorro. */
const RitualCard: React.FC<{ t: Treatment; lang: Lang; onSelect: SelectHandler }> = ({
  t,
  lang,
  onSelect,
}) => {
  const d = t.durations[0];
  return (
    <div className={`${cardBase} p-6 sm:p-7 relative overflow-hidden`}>
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-xs font-bold text-[#8e5d43] uppercase tracking-wider">
            ✦ {lang === 'es' ? t.subtitle : t.subtitleEn}
          </span>
          {d.savings && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              Ahorras ${d.savings} USD
            </span>
          )}
        </div>

        <h3 className="text-2xl font-serif font-bold text-[#2d2a26] mb-1">
          {lang === 'es' ? t.name : t.nameEn}
        </h3>

        <p className="text-xs sm:text-sm text-[#5a534b] leading-relaxed mb-4">
          {lang === 'es' ? t.description : t.descriptionEn}
        </p>

        <div className="bg-[#faf7f2] p-4 rounded-2xl border border-[#ede5d8] mb-5">
          <span className="text-[11px] font-bold text-[#415344] uppercase tracking-wider block mb-2">
            {lang === 'es' ? 'Incluye:' : 'Includes:'}
          </span>
          <ul className="space-y-1.5 text-xs text-[#4a453e]">
            {(lang === 'es' ? t.includes : t.includesEn).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#c5a059] font-bold">✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-[#f0eae1] flex items-center justify-between">
        <div>
          <span className="text-xs text-[#7d7468] block">Duración total: {d.minutes} min</span>
          {d.originalPrice && (
            <span className="text-xs text-gray-400 line-through mr-2">${d.originalPrice} USD</span>
          )}
          <span className="text-2xl font-serif font-bold text-[#415344]">
            ${d.price} <span className="text-xs font-normal text-[#7d7468]">USD</span>
          </span>
        </div>
        <BookButton
          lang={lang}
          onClick={() => onSelect(t, d)}
          className="px-5 py-2.5 gap-1.5 shadow-xs"
        />
      </div>
    </div>
  );
};

/** Masajes y terapias ancestrales: tarjeta compacta con todas las duraciones. */
const CompactCard: React.FC<{ t: Treatment; lang: Lang; onSelect: SelectHandler }> = ({
  t,
  lang,
  onSelect,
}) => (
  <div className={`${cardBase} p-6`}>
    <div>
      {t.badge && (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-[#f4ebe1] text-[#8e5d43] uppercase mb-2">
          {t.badge}
        </span>
      )}
      <h3 className="text-xl font-serif font-bold text-[#2d2a26]">
        {lang === 'es' ? t.name : t.nameEn}
      </h3>
      <Subtitle t={t} lang={lang} />
      <p className="text-xs text-[#5a534b] leading-relaxed mb-4">
        {lang === 'es' ? t.description : t.descriptionEn}
      </p>
      <Benefit t={t} lang={lang} indent="pl-2.5" />
    </div>

    <div className="pt-4 border-t border-[#f0eae1] flex items-center justify-between">
      <div>
        <span className="text-xs text-[#7d7468] block">
          {t.durations.map((d) => `${d.minutes}m`).join(' / ')}
        </span>
        <span className="text-lg font-bold text-[#415344]">
          {t.durations.map((d) => `$${d.price}`).join(' · ')}{' '}
          <span className="text-xs font-normal text-[#7d7468]">USD</span>
        </span>
      </div>
      <BookButton
        lang={lang}
        onClick={() => onSelect(t, t.durations[0])}
        className="px-4 py-2 gap-1"
      />
    </div>
  </div>
);

/** Facial y conexión: tarjeta destacada de una sola duración. */
const FeatureCard: React.FC<{ t: Treatment; lang: Lang; onSelect: SelectHandler }> = ({
  t,
  lang,
  onSelect,
}) => {
  const d = t.durations[0];
  return (
    <div className={`${cardBase} p-6 sm:p-7`}>
      <div>
        <span className="text-xs font-bold text-[#8e5d43] uppercase tracking-wider block mb-1">
          {t.category === 'facial' ? '◇ BIENESTAR FACIAL' : '◎ TERAPIAS DE CONEXIÓN'}
        </span>
        <h3 className="text-2xl font-serif font-bold text-[#2d2a26]">
          {lang === 'es' ? t.name : t.nameEn}
        </h3>
        <Subtitle t={t} lang={lang} />
        <p className="text-xs sm:text-sm text-[#5a534b] leading-relaxed mb-4">
          {lang === 'es' ? t.description : t.descriptionEn}
        </p>
        <Benefit t={t} lang={lang} indent="pl-3" />
      </div>

      <div className="pt-4 border-t border-[#f0eae1] flex items-center justify-between">
        <div>
          <span className="text-xs text-[#7d7468] block">Duración: {d.minutes} min</span>
          <span className="text-xl font-bold text-[#415344]">
            ${d.price} <span className="text-xs font-normal text-[#7d7468]">USD</span>
          </span>
        </div>
        <BookButton lang={lang} onClick={() => onSelect(t, d)} className="px-5 py-2.5 gap-1.5" />
      </div>
    </div>
  );
};

const INFO_CARDS: { title: string; body: React.ReactNode; wide?: boolean; danger?: boolean }[] = [
  {
    title: 'RESERVAS · Reservations',
    body: (
      <>
        Reserva con anticipación. Abono de confirmación: <strong>50% del valor</strong> de la
        experiencia seleccionada (cupos limitados).
      </>
    ),
  },
  {
    title: 'CANCELACIONES · Cancellations',
    body: (
      <>
        Cancelación gratuita y reprogramación flexible <strong>hasta 24 horas antes</strong> de tu
        sesión.
      </>
    ),
  },
  {
    title: 'PAGO · Payment',
    body: <>Efectivo · Transferencia bancaria ({BRAND.bank.name}) · Tarjeta de Crédito / Débito.</>,
  },
  {
    title: 'RECOMENDACIONES',
    body: (
      <>
        • Llegar 10 minutos antes de tu sesión.
        <br />
        • Ropa cómoda o se provee cobertura.
        <br />• Hidratación abundante post-sesión.
      </>
    ),
  },
  {
    title: 'CONTRAINDICACIONES & CONDICIONES ESPECIALES',
    wide: true,
    danger: true,
    body: (
      <>
        Es mandatorio informar{' '}
        <strong>
          embarazo, cirugías recientes, alergias a aceites botánicos o lesiones osteomusculares
        </strong>{' '}
        antes de la sesión a través de nuestra ficha de salud para personalizar o contraindicar
        técnicas de calor o presión profunda.
      </>
    ),
  },
];

export const CatalogView: React.FC<CatalogViewProps> = ({ lang, onSelectForBooking }) => {
  const byCategory = (category: Treatment['category']) =>
    TREATMENTS.filter((t) => t.category === category);
  const es = lang === 'es';

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Cover Brochure Header */}
      <div className="bg-[#2d2a26] text-[#faf7f2] rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden border border-[#4a453e] shadow-xl">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#c5a059] tracking-[0.3em] uppercase">
            <span>✦ {BRAND.fullName} ✦</span>
          </div>

          <h1 className="text-3xl sm:5xl font-serif font-bold text-white tracking-tight">
            {BRAND.therapist.toUpperCase()}
          </h1>
          <p className="text-sm font-medium tracking-[0.2em] text-[#ecd7ab] uppercase">
            {BRAND.subtitle}
          </p>

          <div className="py-4">
            <div className="w-16 h-px bg-[#c5a059]/60 mx-auto mb-4" />
            <p className="font-serif italic text-lg sm:text-xl text-[#f2ede4] font-light max-w-lg mx-auto">
              {quote(lang)}
            </p>
            <div className="w-16 h-px bg-[#c5a059]/60 mx-auto mt-4" />
          </div>

          <div className="pt-2 text-xs text-[#b8ad9f] tracking-widest uppercase flex flex-wrap items-center justify-center gap-4">
            <span>CARTA DE SERVICIOS · MENU OF SERVICES</span>
            <span>·</span>
            <span>Ecuador · 2026</span>
            <span>·</span>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c5a059] hover:underline"
            >
              WhatsApp: {BRAND.whatsapp.display}
            </a>
          </div>
        </div>
      </div>

      {/* Welcome to your Sacred Space Banner */}
      <div className="bg-gradient-to-r from-[#faf7f2] via-[#f5ede2] to-[#faf7f2] p-8 rounded-3xl border border-[#e2d7c5] shadow-xs">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] text-[#8e5d43] uppercase">
            {es ? 'Bienvenida a tu Espacio Sagrado' : 'Welcome to Your Sacred Space'}
          </span>
          <p className="text-sm sm:text-base text-[#4a453e] font-serif italic leading-relaxed">
            {es
              ? 'Cada sesión que vives en este espacio está diseñada para ir más allá del cuerpo. Aquí no solo se relajan los músculos, se libera lo que el alma ha cargado en silencio. Con 14 años de experiencia en bienestar de lujo internacional, fusiono la precisión de las terapias más sofisticadas del mundo con la sabiduría de las tradiciones ancestrales de Ecuador.'
              : 'Each session is designed to go beyond the body. Here, muscles relax and the soul releases what it has silently carried. Blending 14 years of international luxury spa expertise with Ecuador’s ancestral healing wisdom.'}
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs text-[#524c44] font-medium">
            {CREDENTIALS.map((c) => (
              <span
                key={c.title}
                className="px-3 py-1.5 rounded-full bg-white border border-[#d8ccbc] shadow-2xs"
              >
                ✦ {'pill' in c ? c.pill : c.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 1. RITUALES DE TRANSFORMACIÓN */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="✦ Experiencias Completas ✦"
          title={es ? 'Rituales de Transformación' : 'Transformation Rituals'}
          subtitle={
            es
              ? 'Experiencias completas diseñadas para transformar, no solo relajar.'
              : 'Comprehensive experiences designed to transform, not just relax.'
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {byCategory('rituales').map((t) => (
            <RitualCard key={t.id} t={t} lang={lang} onSelect={onSelectForBooking} />
          ))}
        </div>
      </section>

      {/* 2. EXPERIENCIAS CORPORALES & MASAJES */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="◈ Masajes Corporales ◈"
          title={es ? 'Experiencias Corporales' : 'Body Experiences'}
          subtitle={
            es
              ? 'Para quienes buscan una experiencia específica o tienen tiempo limitado.'
              : 'For targeted relief or limited timeframes.'
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {byCategory('masajes').map((t) => (
            <CompactCard key={t.id} t={t} lang={lang} onSelect={onSelectForBooking} />
          ))}
        </div>
      </section>

      {/* 3. TERAPIAS ANCESTRALES Y CERTIFICADAS DE AUTOR */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="✦ Técnicas Originales & Certificadas ✦"
          title={
            es ? 'Terapias Ancestrales y de Autor' : 'Ancestral & Certified Original Therapies'
          }
          subtitle="Barras de Access, Pindas Herbales, Piedras Calientes, Bambuterapia, Quirotermia y Puntos Gatillo."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {byCategory('ancestrales').map((t) => (
            <CompactCard key={t.id} t={t} lang={lang} onSelect={onSelectForBooking} />
          ))}
        </div>
      </section>

      {/* 4. FACIAL KOBIDO & CONEXIÓN PODAL */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...byCategory('facial'), ...byCategory('conexion')].map((t) => (
          <FeatureCard key={t.id} t={t} lang={lang} onSelect={onSelectForBooking} />
        ))}
      </section>

      {/* 5. RESUMEN DE INVERSIÓN */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d7c5] shadow-xs space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#c5a059] tracking-widest uppercase">
            ✦ Tarifario Completo ✦
          </span>
          <h3 className="text-2xl font-serif font-bold text-[#2d2a26]">
            RESUMEN DE INVERSIÓN · INVESTMENT SUMMARY
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#e2d7c5] text-[#8e5d43] uppercase text-[11px] font-bold">
                <th className="py-3 px-3">Servicio / Service</th>
                <th className="py-3 px-3">Duración</th>
                <th className="py-3 px-3">Precio USD</th>
                <th className="py-3 px-3">Ahorras</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eae1] text-[#3e3831]">
              {TREATMENTS.map((t) => (
                <tr key={t.id} className="hover:bg-[#faf8f5] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#2d2a26]">{t.name}</td>
                  <td className="py-3 px-3 text-[#5a534b]">
                    {t.durations.map((d) => `${d.minutes} min`).join(' / ')}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#415344]">
                    {t.durations.map((d) => `$${d.price}`).join(' / ')}
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-semibold">
                    {t.durations[0].savings ? `$${t.durations[0].savings} USD` : '—'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectForBooking(t, t.durations[0])}
                      className="text-xs font-bold text-[#8e5d43] hover:text-[#415344] underline"
                    >
                      Reservar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. INFORMACIÓN IMPORTANTE */}
      <section className="bg-gradient-to-br from-[#faf7f2] to-[#f4ebe1] rounded-3xl p-6 sm:p-8 border border-[#e2d7c5] shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#8e5d43] tracking-widest uppercase">
            ✦ Transparencia & Cuidado ✦
          </span>
          <h3 className="text-2xl font-serif font-bold text-[#2d2a26]">
            INFORMACIÓN IMPORTANTE · IMPORTANT INFORMATION
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-[#524c44]">
          {INFO_CARDS.map((card) => (
            <div
              key={card.title}
              className={`p-4 bg-white rounded-2xl border border-[#ede5d8] space-y-1 ${
                card.wide ? 'sm:col-span-2' : ''
              }`}
            >
              <strong
                className={`text-sm font-serif font-bold block ${
                  card.danger ? 'text-rose-900' : 'text-[#2d2a26]'
                }`}
              >
                {card.title}
              </strong>
              <p className={card.danger ? 'text-rose-950' : undefined}>{card.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4 border-t border-[#e2d7c5] space-y-1">
          <p className="font-serif font-bold text-lg text-[#2d2a26]">{BRAND.therapist}</p>
          <p className="text-xs text-[#8e5d43] tracking-widest uppercase">{BRAND.fullName}</p>
          <p className="text-xs text-[#6e665d]">
            {BRAND.instagram.handle} · {BRAND.whatsapp.display} · Ecuador 2026
          </p>
          <p className="font-serif italic text-sm text-[#415344] mt-2">"{BRAND.motto}"</p>
        </div>
      </section>
    </div>
  );
};
